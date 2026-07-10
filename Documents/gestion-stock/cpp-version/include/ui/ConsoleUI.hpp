#ifndef CONSOLEUI_HPP
#define CONSOLEUI_HPP

#include "../service/StockService.hpp"
#include "../service/RapportService.hpp"
#include <memory>

class ConsoleUI {
private:
    StockService stockService;
    std::unique_ptr<RapportService> rapportService;
    
    void afficherMenuPrincipal() const;
    void afficherMenuProduits();
    void afficherMenuMouvements();
    void afficherMenuRapports();
    
    void gererProduits();
    void gererMouvements();
    void gererRapports();
    void afficherCategories() const;
    
    // Méthodes utilitaires pour la saisie
    std::string saisirChaine(const std::string& message) const;
    double saisirDouble(const std::string& message) const;
    int saisirEntier(const std::string& message) const;
    void attendreEntree() const;

public:
    ConsoleUI();
    void executer();
};

#endif