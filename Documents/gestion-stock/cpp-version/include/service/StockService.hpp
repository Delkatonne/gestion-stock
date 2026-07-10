#ifndef STOCKSERVICE_HPP
#define STOCKSERVICE_HPP

#include "../repository/ProduitRepository.hpp"
#include "../repository/MouvementRepository.hpp"
#include "../models/Categorie.hpp"
#include <vector>
#include <memory>
#include <optional>

class StockService {
private:
    ProduitRepository produitRepo;
    MouvementRepository mouvementRepo;
    std::vector<Categorie> categories;
    
    void initCategories();
    std::string genererId() const;

public:
    StockService();
    
    // Gestion des produits
    std::optional<Produit> creerProduit(const std::string& nom, const std::string& description,
                                        double prix, int quantite, const std::string& categorieId, 
                                        int seuilAlerte);
    std::optional<Produit> getProduit(const std::string& id) const;
    std::vector<Produit> getAllProduits() const;
    std::vector<Produit> getProduitsParCategorie(const std::string& categorieId) const;
    bool supprimerProduit(const std::string& id);
    bool mettreAJourProduit(const std::string& id, int nouvelleQuantite);
    bool mettreAJourProduit(const Produit& produit);
    
    // Gestion des mouvements
    bool enregistrerEntree(const std::string& produitId, int quantite, const std::string& commentaire);
    bool enregistrerSortie(const std::string& produitId, int quantite, const std::string& commentaire);
    bool enregistrerAjustement(const std::string& produitId, int nouvelleQuantite, const std::string& commentaire);
    
    std::vector<MouvementStock> getMouvementsProduit(const std::string& produitId) const;
    std::vector<MouvementStock> getDerniersMouvements(int n) const;
    
    // Utilitaires
    std::vector<Categorie> getCategories() const;
    std::optional<Categorie> getCategorie(const std::string& id) const;
    bool categorieExiste(const std::string& id) const;
};

#endif