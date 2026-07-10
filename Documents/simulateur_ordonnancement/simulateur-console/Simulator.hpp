#ifndef SIMULATOR_HPP
#define SIMULATOR_HPP

#include "Scheduler.hpp"
#include <thread>
#include <atomic>
#include <mutex>
#include <vector>

class Simulator {
private:
    std::unique_ptr<Scheduler> m_scheduler;
    ProcessQueue m_new_queue;
    ProcessQueue m_ready_queue;
    ProcessQueue m_terminated_queue;
    
    std::thread m_dispatcher_thread;
    std::thread m_cpu_thread;
    std::atomic<bool> m_running;
    std::mutex m_display_mutex;

    void dispatcherFunction();
    void cpuFunction();
    void safeDisplay(const std::string& message);

public:
    Simulator(SchedulingAlgorithm algo, uint32_t quantum = 2);
    ~Simulator();

    void addProcess(ProcessPtr process);
    void start();
    void stop();
    void join();
    void displayStats() const;
    void displayTerminatedProcesses();

    // Interdire la copie
    Simulator(const Simulator&) = delete;
    Simulator& operator=(const Simulator&) = delete;
};

#endif