class Scheduler {
    constructor(algorithm, quantum = 2) {
        this.algorithm = algorithm;
        this.quantum = quantum;
        this.currentTime = 0;
        this.completedProcesses = 0;
        this.totalProcesses = 0;
        this.ganttChart = [];
    }

    selectNextProcess(readyQueue) {
        switch(this.algorithm) {
            case 'FIFO':
                return readyQueue.dequeue();
            case 'SJF':
                return readyQueue.dequeueByShortestJob();
            case 'PRIORITY':
                return readyQueue.dequeueByPriority();
            case 'ROUND_ROBIN':
                return readyQueue.dequeue();
            default:
                return readyQueue.dequeue();
        }
    }

    getExecutionTime(process) {
        if (this.algorithm === 'ROUND_ROBIN') {
            return Math.min(process.remainingTime, this.quantum);
        }
        return process.remainingTime;
    }

    isPreemptive() {
        return this.algorithm === 'ROUND_ROBIN';
    }

    addToGantt(pid, startTime, duration) {
        this.ganttChart.push({ pid, startTime, duration });
    }

    calculateStats(processes) {
        let totalWaiting = 0;
        let totalTurnaround = 0;
        const completed = processes.filter(p => p.state === 'TERMINATED');
        
        completed.forEach(p => {
            totalWaiting += p.waitingTime;
            totalTurnaround += p.turnaroundTime;
        });

        return {
            avgWaiting: completed.length > 0 ? totalWaiting / completed.length : 0,
            avgTurnaround: completed.length > 0 ? totalTurnaround / completed.length : 0,
            completedCount: completed.length,
            totalCount: processes.length
        };
    }
}