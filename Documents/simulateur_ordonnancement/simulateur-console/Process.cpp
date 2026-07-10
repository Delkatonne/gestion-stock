#include "Process.hpp"
#include <iostream>
#include <iomanip>

Process::Process(uint32_t pid, uint32_t arrival, uint32_t burst, uint32_t priority)
    : m_pid(pid)
    , m_arrival_time(arrival)
    , m_burst_time(burst)
    , m_remaining_time(burst)
    , m_priority(priority)
    , m_waiting_time(0)
    , m_turnaround_time(0)
    , m_completion_time(0)
    , m_state(ProcessState::NEW)
{
}

void Process::display() const {
    std::cout << "PID: " << std::setw(3) << m_pid
              << " | Arrivee: " << std::setw(3) << m_arrival_time
              << " | Duree: " << std::setw(3) << m_burst_time
              << " | Restant: " << std::setw(3) << m_remaining_time
              << " | Priorite: " << std::setw(3) << m_priority
              << " | Etat: " << std::setw(10) << stateToString(m_state)
              << " | Attente: " << std::setw(3) << m_waiting_time
              << " | Fin: " << std::setw(3) << m_completion_time
              << std::endl;
}

std::string Process::stateToString(ProcessState state) {
    switch(state) {
        case ProcessState::NEW:        return "NOUVEAU";
        case ProcessState::READY:      return "PRET";
        case ProcessState::RUNNING:    return "EXECUTION";
        case ProcessState::WAITING:    return "ATTENTE";
        case ProcessState::TERMINATED: return "TERMINE";
        default:                       return "INCONNU";
    }
}