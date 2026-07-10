class Simulator {
    constructor(algorithm, quantum = 2, speed = 1000) {
        this.scheduler = new Scheduler(algorithm, quantum);
        this.newQueue = new ProcessQueue();
        this.readyQueue = new ProcessQueue();
        this.runningProcess = null;
        this.terminatedQueue = new ProcessQueue();
        this.allProcesses = [];
        this.speed = speed;
        this.isRunning = false;
        this.isPaused = false;
        this.pidCounter = 1;
        this.intervalId = null;
        this.onUpdate = null;
        this.onLog = null;
    }

    addProcess(arrivalTime, burstTime, priority = 1) {
        const process = new Process(this.pidCounter++, arrivalTime, burstTime, priority);
        this.newQueue.enqueue(process);
        this.allProcesses.push(process);
        this.scheduler.totalProcesses++;
        this.log(`Processus P${process.pid} créé - Arrivée: ${arrivalTime}, Durée: ${burstTime}, Priorité: ${priority}`);
    }

    addPresetProcesses(preset) {
        this.reset();
        
        const presets = {
            basic: [
                [0, 6, 2], [1, 4, 1], [2, 3, 3], [3, 5, 1], [4, 2, 2]
            ],
            mixed: [
                [0, 8, 1], [2, 4, 3], [3, 6, 2], [5, 3, 1], [7, 5, 4],
                [8, 2, 2], [10, 7, 1]
            ],
            intensive: [
                [0, 5, 1], [1, 3, 2], [2, 6, 3], [3, 4, 1], [4, 2, 5],
                [5, 7, 2], [6, 3, 1], [7, 5, 4], [8, 4, 3], [9, 6, 2]
            ],
            'priority-test': [
                [0, 8, 5], [1, 6, 1], [2, 4, 3], [3, 2, 4], [4, 10, 2],
                [5, 3, 6], [6, 7, 1], [7, 5, 3]
            ]
        };

        const processes = presets[preset] || presets.basic;
        processes.forEach(([arrival, burst, priority]) => {
            this.addProcess(arrival, burst, priority);
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        this.log('=== Simulation démarrée ===');
        this.run();
    }

    pause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.log('=== Simulation en pause ===');
        } else {
            this.log('=== Simulation reprise ===');
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.log('=== Simulation arrêtée ===');
    }

    reset() {
        this.stop();
        this.scheduler = new Scheduler(this.scheduler.algorithm, this.scheduler.quantum);
        this.newQueue.clear();
        this.readyQueue.clear();
        this.runningProcess = null;
        this.terminatedQueue.clear();
        this.allProcesses = [];
        this.pidCounter = 1;
        this.log('=== Simulation réinitialisée ===');
    }

    run() {
        this.intervalId = setInterval(() => {
            if (!this.isRunning || this.isPaused) return;
            this.step();
        }, this.speed);
    }

    step() {
        // Déplacer les processus arrivés de NEW à READY
        const arrivedProcesses = [];
        while (!this.newQueue.isEmpty()) {
            const process = this.newQueue.peek();
            if (process.arrivalTime <= this.scheduler.currentTime) {
                arrivedProcesses.push(this.newQueue.dequeue());
            } else {
                break;
            }
        }

        arrivedProcesses.forEach(process => {
            process.state = 'READY';
            this.readyQueue.enqueue(process);
            this.log(`[T=${this.scheduler.currentTime}] P${process.pid} déplacé vers la file PRÊT`);
        });

        // Gérer le processus en cours d'exécution
        if (this.runningProcess) {
            this.runningProcess.remainingTime--;
            
            if (this.runningProcess.remainingTime <= 0) {
                // Processus terminé
                this.runningProcess.completionTime = this.scheduler.currentTime + 1;
                this.runningProcess.turnaroundTime = this.runningProcess.completionTime - this.runningProcess.arrivalTime;
                this.runningProcess.waitingTime = this.runningProcess.turnaroundTime - this.runningProcess.burstTime;
                this.runningProcess.state = 'TERMINATED';
                
                this.terminatedQueue.enqueue(this.runningProcess);
                this.scheduler.completedProcesses++;
                
                this.log(`[T=${this.scheduler.currentTime + 1}] P${this.runningProcess.pid} TERMINÉ`);
                
                this.scheduler.addToGantt(
                    this.runningProcess.pid,
                    this.scheduler.currentTime,
                    1
                );
                
                this.runningProcess = null;
            } else if (this.scheduler.isPreemptive() && 
                      this.scheduler.currentTime % this.scheduler.quantum === this.scheduler.quantum - 1) {
                // Préemption Round Robin
                this.runningProcess.state = 'READY';
                this.readyQueue.enqueue(this.runningProcess);
                this.log(`[T=${this.scheduler.currentTime + 1}] P${this.runningProcess.pid} préempté`);
                
                this.scheduler.addToGantt(
                    this.runningProcess.pid,
                    this.scheduler.currentTime,
                    1
                );
                
                this.runningProcess = null;
            }
        }

        // Sélectionner un nouveau processus si nécessaire
        if (!this.runningProcess && !this.readyQueue.isEmpty()) {
            this.runningProcess = this.scheduler.selectNextProcess(this.readyQueue);
            if (this.runningProcess) {
                this.runningProcess.state = 'RUNNING';
                if (!this.runningProcess.startTime) {
                    this.runningProcess.startTime = this.scheduler.currentTime;
                }
                this.log(`[T=${this.scheduler.currentTime}] P${this.runningProcess.pid} en cours d'exécution`);
            }
        }

        this.scheduler.currentTime++;

        // Vérifier si tous les processus sont terminés
        if (this.allProcesses.every(p => p.state === 'TERMINATED') && 
            this.newQueue.isEmpty() && 
            this.readyQueue.isEmpty() && 
            !this.runningProcess) {
            this.stop();
            this.log('=== Tous les processus sont terminés ===');
        }

        // Notifier la mise à jour de l'interface
        if (this.onUpdate) {
            this.onUpdate(this.getState());
        }
    }

    getState() {
        const stats = this.scheduler.calculateStats(this.allProcesses);
        
        return {
            currentTime: this.scheduler.currentTime,
            algorithm: this.scheduler.algorithm,
            quantum: this.scheduler.quantum,
            newQueue: this.newQueue.getAll(),
            readyQueue: this.readyQueue.getAll(),
            runningProcess: this.runningProcess,
            terminatedQueue: this.terminatedQueue.getAll(),
            allProcesses: this.allProcesses,
            ganttChart: this.scheduler.ganttChart,
            stats: stats,
            isRunning: this.isRunning,
            isPaused: this.isPaused
        };
    }

    log(message) {
        if (this.onLog) {
            this.onLog(message);
        }
    }
}