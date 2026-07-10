#ifndef PROCESS_QUEUE_HPP
#define PROCESS_QUEUE_HPP

#include "Process.hpp"
#include <vector>
#include <mutex>
#include <condition_variable>
#include <algorithm>
#include <memory>
#include <functional>

class ProcessQueue {
private:
    std::vector<ProcessPtr> m_queue;
    mutable std::mutex m_mutex;
    std::condition_variable m_not_empty;
    bool m_closed;

public:
    ProcessQueue();
    ~ProcessQueue() = default;

    void enqueue(ProcessPtr process);
    ProcessPtr dequeue();
    ProcessPtr dequeueByPriority();
    ProcessPtr dequeueByShortestJob();
    ProcessPtr tryDequeue();
    ProcessPtr tryDequeueByPriority();
    ProcessPtr tryDequeueByShortestJob();
    ProcessPtr peek() const;
    bool isEmpty() const;
    size_t size() const;
    void clear();
    void close();
    bool isClosed() const;
    std::vector<ProcessPtr> getAllProcesses() const;

    // Interdire la copie
    ProcessQueue(const ProcessQueue&) = delete;
    ProcessQueue& operator=(const ProcessQueue&) = delete;

    // Permettre le déplacement
    ProcessQueue(ProcessQueue&&) = delete;
    ProcessQueue& operator=(ProcessQueue&&) = delete;
};

// ============================================
// Implémentation des méthodes
// ============================================

inline ProcessQueue::ProcessQueue() 
    : m_closed(false) 
{
}

inline void ProcessQueue::enqueue(ProcessPtr process) {
    if (!process) return;
    
    std::lock_guard<std::mutex> lock(m_mutex);
    m_queue.push_back(process);
    m_not_empty.notify_one();
}

inline ProcessPtr ProcessQueue::dequeue() {
    std::unique_lock<std::mutex> lock(m_mutex);
    
    m_not_empty.wait(lock, [this]() {
        return !m_queue.empty() || m_closed;
    });
    
    if (m_queue.empty()) {
        return nullptr; // Queue fermée et vide
    }
    
    ProcessPtr process = m_queue.front();
    m_queue.erase(m_queue.begin());
    return process;
}

inline ProcessPtr ProcessQueue::tryDequeue() {
    std::lock_guard<std::mutex> lock(m_mutex);
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    ProcessPtr process = m_queue.front();
    m_queue.erase(m_queue.begin());
    return process;
}

inline ProcessPtr ProcessQueue::dequeueByPriority() {
    std::unique_lock<std::mutex> lock(m_mutex);
    
    m_not_empty.wait(lock, [this]() {
        return !m_queue.empty() || m_closed;
    });
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    // Trouver le processus avec la priorité la plus haute (valeur la plus basse)
    auto it = std::min_element(m_queue.begin(), m_queue.end(),
        [](const ProcessPtr& a, const ProcessPtr& b) {
            if (a->getPriority() != b->getPriority()) {
                return a->getPriority() < b->getPriority();
            }
            // Si même priorité, prendre le plus ancien (FIFO)
            return a->getArrivalTime() < b->getArrivalTime();
        });
    
    ProcessPtr process = *it;
    m_queue.erase(it);
    return process;
}

inline ProcessPtr ProcessQueue::tryDequeueByPriority() {
    std::lock_guard<std::mutex> lock(m_mutex);
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    auto it = std::min_element(m_queue.begin(), m_queue.end(),
        [](const ProcessPtr& a, const ProcessPtr& b) {
            if (a->getPriority() != b->getPriority()) {
                return a->getPriority() < b->getPriority();
            }
            return a->getArrivalTime() < b->getArrivalTime();
        });
    
    ProcessPtr process = *it;
    m_queue.erase(it);
    return process;
}

inline ProcessPtr ProcessQueue::dequeueByShortestJob() {
    std::unique_lock<std::mutex> lock(m_mutex);
    
    m_not_empty.wait(lock, [this]() {
        return !m_queue.empty() || m_closed;
    });
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    // Trouver le processus avec le temps restant le plus court
    auto it = std::min_element(m_queue.begin(), m_queue.end(),
        [](const ProcessPtr& a, const ProcessPtr& b) {
            if (a->getRemainingTime() != b->getRemainingTime()) {
                return a->getRemainingTime() < b->getRemainingTime();
            }
            // Si même temps restant, prendre le plus ancien (FIFO)
            return a->getArrivalTime() < b->getArrivalTime();
        });
    
    ProcessPtr process = *it;
    m_queue.erase(it);
    return process;
}

inline ProcessPtr ProcessQueue::tryDequeueByShortestJob() {
    std::lock_guard<std::mutex> lock(m_mutex);
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    auto it = std::min_element(m_queue.begin(), m_queue.end(),
        [](const ProcessPtr& a, const ProcessPtr& b) {
            if (a->getRemainingTime() != b->getRemainingTime()) {
                return a->getRemainingTime() < b->getRemainingTime();
            }
            return a->getArrivalTime() < b->getArrivalTime();
        });
    
    ProcessPtr process = *it;
    m_queue.erase(it);
    return process;
}

inline ProcessPtr ProcessQueue::peek() const {
    std::lock_guard<std::mutex> lock(m_mutex);
    
    if (m_queue.empty()) {
        return nullptr;
    }
    
    return m_queue.front();
}

inline bool ProcessQueue::isEmpty() const {
    std::lock_guard<std::mutex> lock(m_mutex);
    return m_queue.empty();
}

inline size_t ProcessQueue::size() const {
    std::lock_guard<std::mutex> lock(m_mutex);
    return m_queue.size();
}

inline void ProcessQueue::clear() {
    std::lock_guard<std::mutex> lock(m_mutex);
    m_queue.clear();
}

inline void ProcessQueue::close() {
    std::lock_guard<std::mutex> lock(m_mutex);
    m_closed = true;
    m_not_empty.notify_all();
}

inline bool ProcessQueue::isClosed() const {
    std::lock_guard<std::mutex> lock(m_mutex);
    return m_closed;
}

inline std::vector<ProcessPtr> ProcessQueue::getAllProcesses() const {
    std::lock_guard<std::mutex> lock(m_mutex);
    return m_queue; // Retourne une copie
}

// ============================================
// Classe ProcessQueueManager (gestionnaire de files multiples)
// ============================================

class ProcessQueueManager {
private:
    ProcessQueue m_new_queue;
    ProcessQueue m_ready_queue;
    ProcessQueue m_waiting_queue;
    ProcessQueue m_terminated_queue;
    mutable std::mutex m_manager_mutex;

public:
    ProcessQueueManager() = default;
    ~ProcessQueueManager() = default;

    // Getters pour chaque file
    ProcessQueue& getNewQueue() { return m_new_queue; }
    ProcessQueue& getReadyQueue() { return m_ready_queue; }
    ProcessQueue& getWaitingQueue() { return m_waiting_queue; }
    ProcessQueue& getTerminatedQueue() { return m_terminated_queue; }

    // Opérations pratiques
    void moveToReady();
    void moveToWaiting(ProcessPtr process);
    void moveToReady(ProcessPtr process);
    void moveToTerminated(ProcessPtr process);
    size_t getTotalProcesses() const;
    bool allProcessesCompleted() const;

    // Fermer toutes les files
    void closeAll();

    // Interdire la copie
    ProcessQueueManager(const ProcessQueueManager&) = delete;
    ProcessQueueManager& operator=(const ProcessQueueManager&) = delete;
};

// Implémentation de ProcessQueueManager

inline void ProcessQueueManager::moveToReady() {
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    
    while (!m_new_queue.isEmpty()) {
        ProcessPtr process = m_new_queue.tryDequeue();
        if (process) {
            process->setState(ProcessState::READY);
            m_ready_queue.enqueue(process);
        }
    }
}

inline void ProcessQueueManager::moveToWaiting(ProcessPtr process) {
    if (!process) return;
    
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    process->setState(ProcessState::WAITING);
    m_waiting_queue.enqueue(process);
}

inline void ProcessQueueManager::moveToReady(ProcessPtr process) {
    if (!process) return;
    
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    process->setState(ProcessState::READY);
    m_ready_queue.enqueue(process);
}

inline void ProcessQueueManager::moveToTerminated(ProcessPtr process) {
    if (!process) return;
    
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    process->setState(ProcessState::TERMINATED);
    m_terminated_queue.enqueue(process);
}

inline size_t ProcessQueueManager::getTotalProcesses() const {
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    return m_new_queue.size() + 
           m_ready_queue.size() + 
           m_waiting_queue.size() + 
           m_terminated_queue.size();
}

inline bool ProcessQueueManager::allProcessesCompleted() const {
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    return m_new_queue.isEmpty() && 
           m_ready_queue.isEmpty() && 
           m_waiting_queue.isEmpty();
}

inline void ProcessQueueManager::closeAll() {
    std::lock_guard<std::mutex> lock(m_manager_mutex);
    m_new_queue.close();
    m_ready_queue.close();
    m_waiting_queue.close();
    m_terminated_queue.close();
}

// ============================================
// Classe ProcessFactory (création simplifiée de processus)
// ============================================

class ProcessFactory {
private:
    static uint32_t s_next_pid;

public:
    static ProcessPtr createProcess(uint32_t arrival, uint32_t burst, uint32_t priority = 1);
    static std::vector<ProcessPtr> createBatch(
        const std::vector<std::tuple<uint32_t, uint32_t, uint32_t>>& params);
    static void resetPidCounter();
};

// Implémentation de ProcessFactory

inline uint32_t ProcessFactory::s_next_pid = 1;

inline ProcessPtr ProcessFactory::createProcess(uint32_t arrival, uint32_t burst, uint32_t priority) {
    auto process = std::make_shared<Process>(s_next_pid++, arrival, burst, priority);
    return process;
}

inline std::vector<ProcessPtr> ProcessFactory::createBatch(
    const std::vector<std::tuple<uint32_t, uint32_t, uint32_t>>& params) {
    
    std::vector<ProcessPtr> processes;
    processes.reserve(params.size());
    
    for (const auto& [arrival, burst, priority] : params) {
        processes.push_back(createProcess(arrival, burst, priority));
    }
    
    return processes;
}

inline void ProcessFactory::resetPidCounter() {
    s_next_pid = 1;
}

#endif // PROCESS_QUEUE_HPP