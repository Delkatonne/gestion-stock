#include "Simulator.hpp"
#include <iostream>
#include <limits>

int main() {
    std::cout << "=== SIMULATEUR D'ORDONNANCEMENT DE PROCESSUS ===\n\n";
    std::cout << "Selectionnez l'algorithme:\n";
    std::cout << "1. FIFO\n";
    std::cout << "2. SJF (Shortest Job First)\n";
    std::cout << "3. Priorite\n";
    std::cout << "4. Round Robin\n";
    std::cout << "Choix: ";
    
    int choix;
    std::cin >> choix;
    
    SchedulingAlgorithm algo;
    uint32_t quantum = 2;
    
    switch(choix) {
        case 1: algo = SchedulingAlgorithm::FIFO; break;
        case 2: algo = SchedulingAlgorithm::SJF; break;
        case 3: algo = SchedulingAlgorithm::PRIORITY; break;
        case 4: 
            algo = SchedulingAlgorithm::ROUND_ROBIN;
            std::cout << "Quantum (unites de temps): ";
            std::cin >> quantum;
            break;
        default: 
            std::cout << "Choix invalide, utilisation de FIFO par defaut\n";
            algo = SchedulingAlgorithm::FIFO;
    }
    
    Simulator sim(algo, quantum);
    
    // Creation des processus
    sim.addProcess(std::make_shared<Process>(1, 0, 6, 2));
    sim.addProcess(std::make_shared<Process>(2, 1, 4, 1));
    sim.addProcess(std::make_shared<Process>(3, 2, 3, 3));
    sim.addProcess(std::make_shared<Process>(4, 3, 5, 1));
    sim.addProcess(std::make_shared<Process>(5, 4, 2, 2));
    
    std::cout << "\nDemarrage de la simulation...\n\n";
    
    sim.start();
    
    // Attendre la fin de la simulation (5 secondes)
    std::this_thread::sleep_for(std::chrono::seconds(5));
    
    sim.stop();
    sim.join();
    
    sim.displayTerminatedProcesses();
    sim.displayStats();
    
    return 0;
}