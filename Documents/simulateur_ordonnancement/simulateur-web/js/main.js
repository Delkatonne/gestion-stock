class SimulatorUI {
    constructor() {
        this.simulator = null;
        this.init();
    }

    init() {
        this.simulator = new Simulator('FIFO', 2, 1000);
        
        this.setupEventListeners();
        this.setupSimulatorCallbacks();
        this.updateUI();
    }

    setupEventListeners() {
        // Changement d'algorithme
        document.getElementById('algorithm').addEventListener('change', (e) => {
            const quantumGroup = document.getElementById('quantum-group');
            if (e.target.value === 'ROUND_ROBIN') {
                quantumGroup.style.display = 'block';
            } else {
                quantumGroup.style.display = 'none';
            }
            
            this.simulator.scheduler.algorithm = e.target.value;
            this.simulator.log(`Algorithme changé pour: ${e.target.value}`);
        });

        // Changement de quantum
        document.getElementById('quantum').addEventListener('change', (e) => {
            this.simulator.scheduler.quantum = parseInt(e.target.value);
            this.simulator.log(`Quantum changé pour: ${e.target.value}`);
        });

        // Changement de vitesse
        document.getElementById('speed').addEventListener('change', (e) => {
            const newSpeed = parseInt(e.target.value);
            this.simulator.speed = newSpeed;
            if (this.simulator.isRunning) {
                this.simulator.stop();
                this.simulator.start();
            }
            this.simulator.log(`Vitesse changée pour: ${newSpeed}ms`);
        });

        // Ajouter un processus
        document.getElementById('add-process').addEventListener('click', () => {
            const arrival = parseInt(document.getElementById('arrival').value) || 0;
            const burst = parseInt(document.getElementById('burst').value) || 5;
            const priority = parseInt(document.getElementById('priority').value) || 1;
            
            this.simulator.addProcess(arrival, burst, priority);
            this.updateUI();
        });

        // Boutons d'action
        document.getElementById('start-simulation').addEventListener('click', () => {
            this.simulator.start();
            this.updateButtons();
        });

        document.getElementById('pause-simulation').addEventListener('click', () => {
            this.simulator.pause();
            this.updateButtons();
        });

        document.getElementById('stop-simulation').addEventListener('click', () => {
            this.simulator.stop();
            this.updateButtons();
        });

        document.getElementById('reset-simulation').addEventListener('click', () => {
            this.simulator.reset();
            this.updateUI();
            this.updateButtons();
        });

        // Modal des préréglages
        document.getElementById('add-preset').addEventListener('click', () => {
            document.getElementById('preset-modal').style.display = 'block';
        });

        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('preset-modal').style.display = 'none';
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.simulator.addPresetProcesses(preset);
                document.getElementById('preset-modal').style.display = 'none';
                this.updateUI();
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('preset-modal')) {
                document.getElementById('preset-modal').style.display = 'none';
            }
        });
    }

    setupSimulatorCallbacks() {
        this.simulator.onUpdate = (state) => {
            this.updateUI(state);
            this.updateButtons();
        };

        this.simulator.onLog = (message) => {
            this.addLog(message);
        };
    }

    updateUI(state = null) {
        if (!state) {
            state = this.simulator.getState();
        }

        // Mettre à jour les statistiques
        document.getElementById('current-time').textContent = state.currentTime;
        document.getElementById('completed-count').textContent = 
            `${state.stats.completedCount}/${state.stats.totalCount}`;
        document.getElementById('avg-waiting').textContent = 
            state.stats.avgWaiting.toFixed(2);
        document.getElementById('avg-turnaround').textContent = 
            state.stats.avgTurnaround.toFixed(2);

        // Mettre à jour les files d'attente
        this.updateQueueDisplay('new-queue', state.newQueue);
        this.updateQueueDisplay('ready-queue', state.readyQueue);
        this.updateRunningDisplay('running-queue', state.runningProcess);
        this.updateQueueDisplay('terminated-queue', state.terminatedQueue);

        // Mettre à jour le diagramme de Gantt
        this.updateGanttChart(state.ganttChart);
    }

    updateQueueDisplay(elementId, processes) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';

        processes.forEach(process => {
            const processElement = this.createProcessElement(process);
            element.appendChild(processElement);
        });
    }

    updateRunningDisplay(elementId, process) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';

        if (process) {
            const processElement = this.createProcessElement(process);
            processElement.classList.add('running');
            element.appendChild(processElement);
        }
    }

    createProcessElement(process) {
        const div = document.createElement('div');
        div.className = 'process-item';
        if (process.state === 'TERMINATED') {
            div.classList.add('completed');
        }
        
        div.innerHTML = `
            <strong>P${process.pid}</strong>
            <div style="font-size: 0.8em;">
                Temps: ${process.remainingTime}/${process.burstTime}
                ${process.priority ? ` | Prio: ${process.priority}` : ''}
            </div>
        `;
        
        return div;
    }

    updateGanttChart(ganttData) {
        const element = document.getElementById('gantt-content');
        element.innerHTML = '';

        if (ganttData.length === 0) return;

        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
            '#BB8FCE', '#85C1E9'
        ];

        let lastPid = null;
        let currentBlock = null;

        ganttData.forEach((block, index) => {
            if (block.pid !== lastPid) {
                currentBlock = document.createElement('div');
                currentBlock.className = 'gantt-block';
                currentBlock.style.backgroundColor = colors[(block.pid - 1) % colors.length];
                currentBlock.textContent = `P${block.pid}`;
                currentBlock.style.width = '30px';
                element.appendChild(currentBlock);
                lastPid = block.pid;
            } else {
                if (currentBlock) {
                    const currentWidth = parseInt(currentBlock.style.width);
                    currentBlock.style.width = (currentWidth + 30) + 'px';
                }
            }
        });
    }

    addLog(message) {
        const logElement = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        if (message.includes('TERMINÉ')) {
            entry.classList.add('info');
        } else if (message.includes('arrêté') || message.includes('pause')) {
            entry.classList.add('warning');
        } else if (message.includes('erreur')) {
            entry.classList.add('error');
        }
        
        entry.textContent = message;
        logElement.appendChild(entry);
        logElement.scrollTop = logElement.scrollHeight;
    }

    updateButtons() {
        const startBtn = document.getElementById('start-simulation');
        const pauseBtn = document.getElementById('pause-simulation');
        const stopBtn = document.getElementById('stop-simulation');

        if (this.simulator.isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            if (this.simulator.isPaused) {
                pauseBtn.textContent = '▶ Reprendre';
            } else {
                pauseBtn.textContent = '⏸️ Pause';
            }
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            pauseBtn.textContent = '⏸️ Pause';
        }
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new SimulatorUI();
});