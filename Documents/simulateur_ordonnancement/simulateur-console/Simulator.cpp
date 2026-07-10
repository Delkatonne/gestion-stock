#include "Simulator.hpp"
#include <iostream>
#include <chrono>
#include <iomanip>

Simulator::Simulator(SchedulingAlgorithm algo, uint32_t quantum)
    : m_scheduler(createScheduler(algo, quantum))
    , m_running(false)
{
}

Simulator::~Simulator() {
    stop();
    if (m_dispatcher_thread.joinable()) {
        m_dispatcher_thread.join();
    }
    if (m_cpu_thread.joinable()) {
        m_cpu_thread.join();
    }
}

void Simulator::safeDisplay(const std::string& message) {
    std::lock_guard<std::mutex> lock(m_display_mutex);
    std::cout << message << std::endl;
}

void Simulator::addProcess(ProcessPtr process) {
    m_new_queue.enqueue(process);
    m_scheduler->m_total_processes++;
}

void Simulator::start() {
    if (m_running) return;
    m_running = true;
    m_dispatcher_thread = std::thread(&Simulator::dispatcherFunction, this);
    m_cpu_thread = std::thread(&Simulator::cpuFunction, this);
}

void Simulator::stop() {
    m_running = false;
    m_new_queue.close();
    m_ready_queue.close();
}

void Simulator::join() {
    if (m_dispatcher_thread.joinable()) {
        m_dispatcher_thread.join();
    }
    if (m_cpu_thread.joinable()) {
        m_cpu_thread.join();
    }
}

void Simulator::dispatcherFunction() {
    while (m_running || !m_new_queue.isEmpty()) {
        ProcessPtr process = m_new_queue.dequeue();
        
        if (process) {
            process->setState(ProcessState::READY);
            m_ready_queue.enqueue(process);
            safeDisplay("[DISPATCHER] Processus " + std::to_string(process->getPid()) + 
                       " deplace vers file PRET (temps arrivee: " + 
                       std::to_string(process->getArrivalTime()) + ")");
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    
    m_ready_queue.close();
    safeDisplay("[DISPATCHER] Arret du dispatcher");
}

void Simulator::cpuFunction() {
    ProcessPtr current_process = nullptr;
    
    while (m_running || !m_ready_queue.isEmpty() || current_process) {
        if (!current_process && !m_ready_queue.isEmpty()) {
            current_process = m_scheduler->selectNextProcess(m_ready_queue);
            
            if (current_process) {
                current_process->setState(ProcessState::RUNNING);
                safeDisplay("[CPU] Execution du processus " + 
                           std::to_string(current_process->getPid()) + 
                           " (restant: " + std::to_string(current_process->getRemainingTime()) + ")");
            }
        }
        
        if (current_process) {
            uint32_t execution_time = m_scheduler->getExecutionTime(current_process);
            
            if (m_scheduler->isPreemptive() && m_scheduler->getQuantum() > 0) {
                execution_time = std::min(current_process->getRemainingTime(), 
                                         m_scheduler->getQuantum());
            }
            
            current_process->setRemainingTime(current_process->getRemainingTime() - execution_time);
            m_scheduler->incrementTime(execution_time);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
            
            if (current_process->getRemainingTime() <= 0) {
                m_scheduler->updateStats(current_process);
                m_terminated_queue.enqueue(current_process);
                safeDisplay("[CPU] Processus " + std::to_string(current_process->getPid()) + 
                           " termine (temps completion: " + 
                           std::to_string(current_process->getCompletionTime()) + ")");
                current_process = nullptr;
            } else if (m_scheduler->isPreemptive()) {
                current_process->setState(ProcessState::READY);
                m_ready_queue.enqueue(current_process);
                safeDisplay("[CPU] Processus " + std::to_string(current_process->getPid()) + 
                           " preempte (restant: " + 
                           std::to_string(current_process->getRemainingTime()) + 
                           "), retour file PRET");
                current_process = nullptr;
            }
        } else {
            m_scheduler->incrementTime(1);
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    }
    
    safeDisplay("[CPU] Arret du CPU");
}

void Simulator::displayStats() const {
    std::cout << "\n============================================\n";
    std::cout << "      STATISTIQUES DE LA SIMULATION\n";
    std::cout << "============================================\n";
    std::cout << "Algorithme: " << m_scheduler->getName() << "\n";
    if (m_scheduler->isPreemptive()) {
        std::cout << "Quantum: " << m_scheduler->getQuantum() << "\n";
    }
    std::cout << "Temps total execution: " << m_scheduler->getCurrentTime() << "\n";
    std::cout << "Processus total: " << m_scheduler->getTotalProcesses() << "\n";
    std::cout << "Processus termines: " << m_scheduler->getCompletedProcesses() << "\n";
    std::cout << "Temps d'attente moyen: " << std::fixed << std::setprecision(2) 
              << m_scheduler->getAvgWaitingTime() << "\n";
    std::cout << "Temps de rotation moyen: " << std::fixed << std::setprecision(2) 
              << m_scheduler->getAvgTurnaroundTime() << "\n";
    std::cout << "============================================\n\n";
}

void Simulator::displayTerminatedProcesses() {
    std::cout << "\nProcessus termines:\n";
    std::cout << "------------------------------------------------------------\n";
    while (!m_terminated_queue.isEmpty()) {
        ProcessPtr p = m_terminated_queue.dequeue();
        if (p) {
            p->display();
        }
    }
    std::cout << "------------------------------------------------------------\n";
}