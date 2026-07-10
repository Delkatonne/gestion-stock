#ifndef PROCESS_HPP
#define PROCESS_HPP

#include <cstdint>
#include <string>
#include <memory>

enum class ProcessState {
    NEW,
    READY,
    RUNNING,
    WAITING,
    TERMINATED
};

class Process {
private:
    uint32_t m_pid;
    uint32_t m_arrival_time;
    uint32_t m_burst_time;
    uint32_t m_remaining_time;
    uint32_t m_priority;
    uint32_t m_waiting_time;
    uint32_t m_turnaround_time;
    uint32_t m_completion_time;
    ProcessState m_state;

public:
    Process(uint32_t pid, uint32_t arrival, uint32_t burst, uint32_t priority);
    ~Process() = default;

    // Getters
    uint32_t getPid() const { return m_pid; }
    uint32_t getArrivalTime() const { return m_arrival_time; }
    uint32_t getBurstTime() const { return m_burst_time; }
    uint32_t getRemainingTime() const { return m_remaining_time; }
    uint32_t getPriority() const { return m_priority; }
    uint32_t getWaitingTime() const { return m_waiting_time; }
    uint32_t getTurnaroundTime() const { return m_turnaround_time; }
    uint32_t getCompletionTime() const { return m_completion_time; }
    ProcessState getState() const { return m_state; }

    // Setters
    void setRemainingTime(uint32_t time) { m_remaining_time = time; }
    void setWaitingTime(uint32_t time) { m_waiting_time = time; }
    void setTurnaroundTime(uint32_t time) { m_turnaround_time = time; }
    void setCompletionTime(uint32_t time) { m_completion_time = time; }
    void setState(ProcessState state) { m_state = state; }

    void display() const;
    static std::string stateToString(ProcessState state);
};

using ProcessPtr = std::shared_ptr<Process>;

#endif