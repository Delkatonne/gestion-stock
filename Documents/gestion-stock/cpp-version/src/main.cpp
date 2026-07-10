#include "../include/ui/ConsoleUI.hpp"
#include <iostream>

int main() {
    try {
        ConsoleUI ui;
        std::cout << "=== SYSTEME DE GESTION DE STOCK ===\n";
        std::cout << "Bienvenue dans l'application de gestion d'inventaire\n\n";
        
        ui.executer();
    }
    catch (const std::exception& e) {
        std::cerr << "Erreur: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}