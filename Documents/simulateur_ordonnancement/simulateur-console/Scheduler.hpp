#ifndef SCHEDULER_HPP
#define SCHEDULER_HPP

#include "ProcessQueue.hpp"
#include <string>

enum class SchedulingAlgorithm {
    FIFO,
    SJF,
    PRIORITY,
    ROUND_ROBIN
};

class Scheduler {
protected:
    uint32_t m_current_time;
    uint32_t m_total_processes;
    uint32_t m_completed_processes;
    double m_avg_waiting_time;
    double m_avg_turnaround_time;
    uint32_t m_quantum;

public:
    Scheduler(uint32_t quantum = 2);
    virtual ~Scheduler() = default;

    virtual ProcessPtr selectNextProcess(ProcessQueue& ready_queue) = 0;
    virtual uint32_t getExecutionTime(ProcessPtr process) const;
    virtual bool isPreemptive() const = 0;
    virtual std::string getName() const = 0;
    
    void updateStats(ProcessPtr process);
    void incrementTime(uint32_t delta = 1);

    // Getters
    uint32_t getCurrentTime() const { return m_current_time; }
    uint32_t getTotalProcesses() const { return m_total_processes; }
    uint32_t getCompletedProcesses() const { return m_completed_processes; }
    double getAvgWaitingTime() const { return m_avg_waiting_time; }
    double getAvgTurnaroundTime() const { return m_avg_turnaround_time; }
    uint32_t getQuantum() const { return m_quantum; }
};

class FIFOScheduler : public Scheduler {
public:
    FIFOScheduler() : Scheduler(0) {}
    ProcessPtr selectNextProcess(ProcessQueue& ready_queue) override;
    bool isPreemptive() const override { return false; }
    std::string getName() const override { return "FIFO"; }
};

class SJFScheduler : public Scheduler {
public:
    SJFScheduler() : Scheduler(0) {}
    ProcessPtr selectNextProcess(ProcessQueue& ready_queue) override;
    bool isPreemptive() const override { return false; }
    std::string getName() const override { return "SJF (Shortest Job First)"; }
};

class PriorityScheduler : public Scheduler {
public:
    PriorityScheduler() : Scheduler(0) {}
    ProcessPtr selectNextProcess(ProcessQueue& ready_queue) override;
    bool isPreemptive() const override { return false; }
    std::string getName() const override { return "Priorite"; }
};

class RoundRobinScheduler : public Scheduler {
public:
    RoundRobinScheduler(uint32_t quantum) : Scheduler(quantum) {}
    ProcessPtr selectNextProcess(ProcessQueue& ready_queue) override;
    bool isPreemptive() const override { return true; }
    std::string getName() const override { return "Round Robin"; }
};

// Factory
std::unique_ptr<Scheduler> createScheduler(SchedulingAlgorithm algo, uint32_t quantum = 2);

#endif