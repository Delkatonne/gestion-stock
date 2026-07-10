#include "../../include/ui/ConsoleUI.hpp"
#include <iostream>
#include <limits>
#include <algorithm>
#include <iomanip>

ConsoleUI::ConsoleUI() {
    rapportService = std::make_unique<RapportService>(stockService);
}

void ConsoleUI::executer() {
    int choix;
    do {
        afficherMenuPrincipal();
        std::cin >> choix;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
        switch(choix) {
            case 1:
                gererProduits();
                break;
            case 2:
                gererMouvements();
                break;
            case 3:
                gererRapports();
                break;
            case 4:
                afficherCategories();
                break;
            case 0:
                std::cout << "Au revoir!\n";
                break;
            default:
                std::cout << "Choix invalide. Veuillez réessayer.\n";
        }
    } while(choix != 0);
}

void ConsoleUI::afficherMenuPrincipal() const {
    std::cout << "\n╔════════════════════════════════════════╗\n";
    std::cout << "║     SYSTEME DE GESTION DE STOCK       ║\n";
    std::cout << "╠════════════════════════════════════════╣\n";
    std::cout << "║  1. Gérer les produits                 ║\n";
    std::cout << "║  2. Gérer les mouvements de stock      ║\n";
    std::cout << "║  3. Consulter les rapports             ║\n";
    std::cout << "║  4. Afficher les catégories            ║\n";
    std::cout << "║  0. Quitter                            ║\n";
    std::cout << "╚════════════════════════════════════════╝\n";
    std::cout << "Votre choix: ";
}

void ConsoleUI::afficherMenuProduits() {
    std::cout << "\n--- GESTION DES PRODUITS ---\n";
    std::cout << "1. Ajouter un produit\n";
    std::cout << "2. Modifier un produit\n";
    std::cout << "3. Supprimer un produit\n";
    std::cout << "4. Afficher tous les produits\n";
    std::cout << "5. Afficher par catégorie\n";
    std::cout << "0. Retour\n";
    std::cout << "Votre choix: ";
}

void ConsoleUI::afficherMenuMouvements() {
    std::cout << "\n--- GESTION DES MOUVEMENTS ---\n";
    std::cout << "1. Entrée de stock\n";
    std::cout << "2. Sortie de stock\n";
    std::cout << "3. Ajustement de stock\n";
    std::cout << "4. Afficher les mouvements d'un produit\n";
    std::cout << "5. Afficher les derniers mouvements\n";
    std::cout << "0. Retour\n";
    std::cout << "Votre choix: ";
}

void ConsoleUI::afficherMenuRapports() {
    std::cout << "\n--- RAPPORTS ---\n";
    std::cout << "1. Rapport complet\n";
    std::cout << "2. Produits en stock insuffisant\n";
    std::cout << "3. Valeur totale du stock\n";
    std::cout << "4. Statistiques générales\n";
    std::cout << "5. Derniers mouvements\n";
    std::cout << "0. Retour\n";
    std::cout << "Votre choix: ";
}

void ConsoleUI::gererProduits() {
    int choix;
    do {
        afficherMenuProduits();
        std::cin >> choix;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
        switch(choix) {
            case 1: {
                std::string nom = saisirChaine("Nom: ");
                std::string desc = saisirChaine("Description: ");
                double prix = saisirDouble("Prix: ");
                int quantite = saisirEntier("Quantité: ");
                std::string catId = saisirChaine("Catégorie (CAT1-CAT4): ");
                int seuil = saisirEntier("Seuil d'alerte: ");
                
                auto produit = stockService.creerProduit(nom, desc, prix, quantite, catId, seuil);
                if (produit.has_value()) {
                    std::cout << "✓ Produit créé avec succès! ID: " << produit->getId() << std::endl;
                } else {
                    std::cout << "✗ Erreur: Catégorie invalide.\n";
                }
                break;
            }
            case 2: {
                std::string id = saisirChaine("ID du produit: ");
                auto produit = stockService.getProduit(id);
                if (!produit.has_value()) {
                    std::cout << "✗ Produit non trouvé.\n";
                    break;
                }
                
                std::cout << "Produit actuel:\n";
                produit->afficher();
                std::cout << "\nLaisser vide pour ne pas modifier.\n";
                
                std::string nom = saisirChaine("Nouveau nom: ");
                if (!nom.empty()) {
                    Produit p = produit.value();
                    p.setNom(nom);
                    stockService.mettreAJourProduit(p);
                }
                
                std::string desc = saisirChaine("Nouvelle description: ");
                if (!desc.empty()) {
                    Produit p = produit.value();
                    p.setDescription(desc);
                    stockService.mettreAJourProduit(p);
                }
                
                std::string prixStr = saisirChaine("Nouveau prix: ");
                if (!prixStr.empty()) {
                    Produit p = produit.value();
                    p.setPrix(std::stod(prixStr));
                    stockService.mettreAJourProduit(p);
                }
                
                int quantite = saisirEntier("Nouvelle quantité: ");
                if (quantite >= 0) {
                    stockService.mettreAJourProduit(id, quantite);
                }
                
                std::cout << "✓ Produit mis à jour.\n";
                break;
            }
            case 3: {
                std::string id = saisirChaine("ID du produit à supprimer: ");
                if (stockService.supprimerProduit(id)) {
                    std::cout << "✓ Produit supprimé.\n";
                } else {
                    std::cout << "✗ Produit non trouvé.\n";
                }
                break;
            }
            case 4: {
                auto produits = stockService.getAllProduits();
                std::cout << "\n--- LISTE DES PRODUITS (" << produits.size() << ") ---\n";
                for (const auto& p : produits) {
                    p.afficher();
                }
                break;
            }
            case 5: {
                std::string catId = saisirChaine("Catégorie (CAT1-CAT4): ");
                auto produits = stockService.getProduitsParCategorie(catId);
                std::cout << "\n--- PRODUITS DE LA CATEGORIE " << catId << " (" << produits.size() << ") ---\n";
                for (const auto& p : produits) {
                    p.afficher();
                }
                break;
            }
        }
        if (choix != 0) {
            attendreEntree();
        }
    } while(choix != 0);
}

void ConsoleUI::gererMouvements() {
    int choix;
    do {
        afficherMenuMouvements();
        std::cin >> choix;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
        switch(choix) {
            case 1: {
                std::string id = saisirChaine("ID du produit: ");
                int quantite = saisirEntier("Quantité: ");
                std::string commentaire = saisirChaine("Commentaire: ");
                
                if (stockService.enregistrerEntree(id, quantite, commentaire)) {
                    std::cout << "✓ Entrée enregistrée avec succès.\n";
                } else {
                    std::cout << "✗ Produit non trouvé.\n";
                }
                break;
            }
            case 2: {
                std::string id = saisirChaine("ID du produit: ");
                int quantite = saisirEntier("Quantité: ");
                std::string commentaire = saisirChaine("Commentaire: ");
                
                if (stockService.enregistrerSortie(id, quantite, commentaire)) {
                    std::cout << "✓ Sortie enregistrée avec succès.\n";
                } else {
                    std::cout << "✗ Produit non trouvé ou stock insuffisant.\n";
                }
                break;
            }
            case 3: {
                std::string id = saisirChaine("ID du produit: ");
                int nouvelleQte = saisirEntier("Nouvelle quantité: ");
                std::string commentaire = saisirChaine("Commentaire: ");
                
                if (stockService.enregistrerAjustement(id, nouvelleQte, commentaire)) {
                    std::cout << "✓ Ajustement enregistré avec succès.\n";
                } else {
                    std::cout << "✗ Produit non trouvé.\n";
                }
                break;
            }
            case 4: {
                std::string id = saisirChaine("ID du produit: ");
                auto mouvements = stockService.getMouvementsProduit(id);
                std::cout << "\n--- MOUVEMENTS DU PRODUIT " << id << " (" << mouvements.size() << ") ---\n";
                for (const auto& m : mouvements) {
                    m.afficher();
                }
                break;
            }
            case 5: {
                int n = saisirEntier("Nombre de mouvements à afficher: ");
                auto mouvements = stockService.getDerniersMouvements(n);
                std::cout << "\n--- DERNIERS MOUVEMENTS (" << mouvements.size() << ") ---\n";
                for (const auto& m : mouvements) {
                    m.afficher();
                }
                break;
            }
        }
        if (choix != 0) {
            attendreEntree();
        }
    } while(choix != 0);
}

void ConsoleUI::gererRapports() {
    int choix;
    do {
        afficherMenuRapports();
        std::cin >> choix;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        
        switch(choix) {
            case 1:
                rapportService->genererRapportComplet();
                break;
            case 2:
                rapportService->afficherStockInsuffisant();
                break;
            case 3:
                rapportService->afficherValeurStock();
                break;
            case 4:
                rapportService->afficherStatistiques();
                break;
            case 5:
                rapportService->afficherMouvementsRecents(10);
                break;
        }
        if (choix != 0) {
            attendreEntree();
        }
    } while(choix != 0);
}

void ConsoleUI::afficherCategories() const {
    std::cout << "\n--- CATEGORIES ---\n";
    auto categories = stockService.getCategories();
    for (const auto& c : categories) {
        c.afficher();
    }
    attendreEntree();
}

std::string ConsoleUI::saisirChaine(const std::string& message) const {
    std::cout << message;
    std::string valeur;
    std::getline(std::cin, valeur);
    return valeur;
}

double ConsoleUI::saisirDouble(const std::string& message) const {
    std::cout << message;
    double valeur;
    std::cin >> valeur;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return valeur;
}

int ConsoleUI::saisirEntier(const std::string& message) const {
    std::cout << message;
    int valeur;
    std::cin >> valeur;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return valeur;
}

void ConsoleUI::attendreEntree() const {
    std::cout << "\nAppuyez sur Entrée pour continuer...";
    std::cin.get();
}