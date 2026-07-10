class Process {
    constructor(pid, arrivalTime, burstTime, priority = 1) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.completionTime = 0;
        this.state = 'NEW';
        this.startTime = null;
        this.executionHistory = [];
    }

    getStateColor() {
        const colors = {
            'NEW': '#6c757d',
            'READY': '#ffc107',
            'RUNNING': '#dc3545',
            'WAITING': '#17a2b8',
            'TERMINATED': '#28a745'
        };
        return colors[this.state] || '#6c757d';
    }

    getStateIcon() {
        const icons = {
            'NEW': '📥',
            'READY': '✅',
            'RUNNING': '⚙️',
            'WAITING': '⏳',
            'TERMINATED': '🏁'
        };
        return icons[this.state] || '❓';
    }

    toJSON() {
        return {
            pid: this.pid,
            arrivalTime: this.arrivalTime,
            burstTime: this.burstTime,
            remainingTime: this.remainingTime,
            priority: this.priority,
            waitingTime: this.waitingTime,
            turnaroundTime: this.turnaroundTime,
            completionTime: this.completionTime,
            state: this.state
        };
    }

    clone() {
        const p = new Process(this.pid, this.arrivalTime, this.burstTime, this.priority);
        p.remainingTime = this.remainingTime;
        p.waitingTime = this.waitingTime;
        p.turnaroundTime = this.turnaroundTime;
        p.completionTime = this.completionTime;
        p.state = this.state;
        return p;
    }
}

class ProcessQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(process) {
        this.queue.push(process);
    }

    dequeue() {
        return this.queue.shift() || null;
    }

    dequeueByPriority() {
        if (this.queue.length === 0) return null;
        
        let minIndex = 0;
        for (let i = 1; i < this.queue.length; i++) {
            if (this.queue[i].priority < this.queue[minIndex].priority) {
                minIndex = i;
            }
        }
        return this.queue.splice(minIndex, 1)[0];
    }

    dequeueByShortestJob() {
        if (this.queue.length === 0) return null;
        
        let minIndex = 0;
        for (let i = 1; i < this.queue.length; i++) {
            if (this.queue[i].remainingTime < this.queue[minIndex].remainingTime) {
                minIndex = i;
            }
        }
        return this.queue.splice(minIndex, 1)[0];
    }

    peek() {
        return this.queue[0] || null;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }

    getAll() {
        return [...this.queue];
    }

    clear() {
        this.queue = [];
    }
}