#include "Scheduler.hpp"

Scheduler::Scheduler(uint32_t quantum)
    : m_current_time(0)
    , m_total_processes(0)
    , m_completed_processes(0)
    , m_avg_waiting_time(0.0)
    , m_avg_turnaround_time(0.0)
    , m_quantum(quantum)
{
}

uint32_t Scheduler::getExecutionTime(ProcessPtr process) const {
    return process->getRemainingTime();
}

void Scheduler::updateStats(ProcessPtr process) {
    process->setCompletionTime(m_current_time);
    process->setTurnaroundTime(process->getCompletionTime() - process->getArrivalTime());
    process->setWaitingTime(process->getTurnaroundTime() - process->getBurstTime());
    process->setState(ProcessState::TERMINATED);
    
    m_completed_processes++;
    
    if (m_completed_processes == 1) {
        m_avg_waiting_time = process->getWaitingTime();
        m_avg_turnaround_time = process->getTurnaroundTime();
    } else {
        m_avg_waiting_time = (m_avg_waiting_time * (m_completed_processes - 1) + 
                              process->getWaitingTime()) / m_completed_processes;
        m_avg_turnaround_time = (m_avg_turnaround_time * (m_completed_processes - 1) + 
                                 process->getTurnaroundTime()) / m_completed_processes;
    }
}

void Scheduler::incrementTime(uint32_t delta) {
    m_current_time += delta;
}

ProcessPtr FIFOScheduler::selectNextProcess(ProcessQueue& ready_queue) {
    return ready_queue.dequeue();
}

ProcessPtr SJFScheduler::selectNextProcess(ProcessQueue& ready_queue) {
    return ready_queue.dequeueByShortestJob();
}

ProcessPtr PriorityScheduler::selectNextProcess(ProcessQueue& ready_queue) {
    return ready_queue.dequeueByPriority();
}

ProcessPtr RoundRobinScheduler::selectNextProcess(ProcessQueue& ready_queue) {
    return ready_queue.dequeue();
}

std::unique_ptr<Scheduler> createScheduler(SchedulingAlgorithm algo, uint32_t quantum) {
    switch(algo) {
        case SchedulingAlgorithm::FIFO:
            return std::make_unique<FIFOScheduler>();
        case SchedulingAlgorithm::SJF:
            return std::make_unique<SJFScheduler>();
        case SchedulingAlgorithm::PRIORITY:
            return std::make_unique<PriorityScheduler>();
        case SchedulingAlgorithm::ROUND_ROBIN:
            return std::make_unique<RoundRobinScheduler>(quantum);
        default:
            return std::make_unique<FIFOScheduler>();
    }
}