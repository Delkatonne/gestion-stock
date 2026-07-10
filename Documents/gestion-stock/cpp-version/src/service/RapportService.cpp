#include "../../include/service/RapportService.hpp"
#include <iomanip>
#include <iostream>

RapportService::RapportService(const StockService& service) : stockService(service) {}

void RapportService::genererRapportComplet() const {
    std::cout << "\n=== RAPPORT COMPLET DE STOCK ===\n";
    std::cout << "================================\n\n";
    
    afficherStatistiques();
    std::cout << "\n";
    afficherStockInsuffisant();
    std::cout << "\n";
    afficherMouvementsRecents(5);
    std::cout << "================================\n";
}

void RapportService::afficherStockInsuffisant() const {
    auto produits = stockService.getAllProduits();
    std::vector<Produit> insuffisants;
    
    for (const auto& p : produits) {
        if (p.estEnStockInsuffisant()) {
            insuffisants.push_back(p);
        }
    }
    
    std::cout << "PRODUITS EN STOCK INSUFFISANT (" << insuffisants.size() << "):\n";
    if (insuffisants.empty()) {
        std::cout << "  Aucun produit en stock insuffisant.\n";
    } else {
        for (const auto& p : insuffisants) {
            std::cout << "  - " << p.getNom() << " (ID: " << p.getId() 
                      << ") : " << p.getQuantite() << "/" << p.getSeuilAlerte() << std::endl;
        }
    }
}

void RapportService::afficherValeurStock() const {
    double valeur = calculerValeurStock();
    std::cout << "Valeur totale du stock: " << std::fixed << std::setprecision(2) 
              << valeur << " FCFA" << std::endl;
}

void RapportService::afficherMouvementsRecents(int n) const {
    auto mouvements = stockService.getDerniersMouvements(n);
    std::cout << "DERNIERS MOUVEMENTS (" << mouvements.size() << "):\n";
    if (mouvements.empty()) {
        std::cout << "  Aucun mouvement enregistré.\n";
    } else {
        for (const auto& m : mouvements) {
            m.afficher();
        }
    }
}

void RapportService::afficherStatistiques() const {
    auto produits = stockService.getAllProduits();
    auto mouvements = stockService.getDerniersMouvements(1000); // Tous les mouvements
    
    std::cout << "STATISTIQUES:\n";
    std::cout << "  Nombre de produits: " << produits.size() << std::endl;
    std::cout << "  Nombre de mouvements: " << mouvements.size() << std::endl;
    afficherValeurStock();
    
    // Nombre de produits par catégorie
    std::cout << "  Répartition par catégorie:\n";
    auto categories = stockService.getCategories();
    for (const auto& cat : categories) {
        auto produitsCat = stockService.getProduitsParCategorie(cat.getId());
        std::cout << "    - " << cat.getNom() << ": " << produitsCat.size() << " produits" << std::endl;
    }
}

double RapportService::calculerValeurStock() const {
    double total = 0.0;
    auto produits = stockService.getAllProduits();
    for (const auto& p : produits) {
        total += p.getPrix() * p.getQuantite();
    }
    return total;
}

int RapportService::getNombreProduits() const {
    return stockService.getAllProduits().size();
}

int RapportService::getNombreMouvements() const {
    return stockService.getDerniersMouvements(1000).size();
}