#include "../../include/service/StockService.hpp"
#include <random>
#include <sstream>
#include <iomanip>
#include <algorithm>

StockService::StockService() {
    initCategories();
}

void StockService::initCategories() {
    categories.push_back(Categorie("CAT1", "Électronique", "Produits électroniques"));
    categories.push_back(Categorie("CAT2", "Alimentaire", "Produits alimentaires"));
    categories.push_back(Categorie("CAT3", "Vêtements", "Vêtements et accessoires"));
    categories.push_back(Categorie("CAT4", "Mobilier", "Mobilier et décoration"));
}

std::string StockService::genererId() const {
    static const char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<> dis(0, sizeof(charset) - 2);
    
    std::string id;
    id.reserve(8);
    for (int i = 0; i < 8; ++i) {
        id += charset[dis(gen)];
    }
    return id;
}

std::optional<Produit> StockService::creerProduit(const std::string& nom, const std::string& description,
                                                  double prix, int quantite, const std::string& categorieId, 
                                                  int seuilAlerte) {
    if (!categorieExiste(categorieId)) {
        return std::nullopt;
    }
    
    std::string id = genererId();
    Produit produit(id, nom, description, prix, quantite, categorieId, seuilAlerte);
    produitRepo.save(produit);
    return produit;
}

std::optional<Produit> StockService::getProduit(const std::string& id) const {
    return produitRepo.findById(id);
}

std::vector<Produit> StockService::getAllProduits() const {
    return produitRepo.findAll();
}

std::vector<Produit> StockService::getProduitsParCategorie(const std::string& categorieId) const {
    return produitRepo.findByCategorie(categorieId);
}

bool StockService::supprimerProduit(const std::string& id) {
    return produitRepo.deleteById(id);
}

bool StockService::mettreAJourProduit(const std::string& id, int nouvelleQuantite) {
    auto produit = produitRepo.findById(id);
    if (!produit.has_value()) {
        return false;
    }
    
    Produit p = produit.value();
    p.setQuantite(nouvelleQuantite);
    produitRepo.save(p);
    return true;
}

bool StockService::mettreAJourProduit(const Produit& produit) {
    if (!produitRepo.exists(produit.getId())) {
        return false;
    }
    produitRepo.save(produit);
    return true;
}

bool StockService::enregistrerEntree(const std::string& produitId, int quantite, const std::string& commentaire) {
    auto produit = produitRepo.findById(produitId);
    if (!produit.has_value()) {
        return false;
    }
    
    Produit p = produit.value();
    p.setQuantite(p.getQuantite() + quantite);
    produitRepo.save(p);
    
    MouvementStock mouvement(genererId(), produitId, TypeMouvement::ENTREE, quantite, commentaire);
    mouvementRepo.save(mouvement);
    return true;
}

bool StockService::enregistrerSortie(const std::string& produitId, int quantite, const std::string& commentaire) {
    auto produit = produitRepo.findById(produitId);
    if (!produit.has_value()) {
        return false;
    }
    
    Produit p = produit.value();
    if (p.getQuantite() < quantite) {
        return false;
    }
    
    p.setQuantite(p.getQuantite() - quantite);
    produitRepo.save(p);
    
    MouvementStock mouvement(genererId(), produitId, TypeMouvement::SORTIE, quantite, commentaire);
    mouvementRepo.save(mouvement);
    return true;
}

bool StockService::enregistrerAjustement(const std::string& produitId, int nouvelleQuantite, const std::string& commentaire) {
    auto produit = produitRepo.findById(produitId);
    if (!produit.has_value()) {
        return false;
    }
    
    Produit p = produit.value();
    int ancienneQuantite = p.getQuantite();
    p.setQuantite(nouvelleQuantite);
    produitRepo.save(p);
    
    MouvementStock mouvement(genererId(), produitId, TypeMouvement::AJUSTEMENT, 
                            nouvelleQuantite - ancienneQuantite, commentaire);
    mouvementRepo.save(mouvement);
    return true;
}

std::vector<MouvementStock> StockService::getMouvementsProduit(const std::string& produitId) const {
    return mouvementRepo.findByProduit(produitId);
}

std::vector<MouvementStock> StockService::getDerniersMouvements(int n) const {
    return mouvementRepo.findLastN(n);
}

std::vector<Categorie> StockService::getCategories() const {
    return categories;
}

std::optional<Categorie> StockService::getCategorie(const std::string& id) const {
    auto it = std::find_if(categories.begin(), categories.end(),
                          [&id](const Categorie& c) { return c.getId() == id; });
    if (it != categories.end()) {
        return *it;
    }
    return std::nullopt;
}

bool StockService::categorieExiste(const std::string& id) const {
    return getCategorie(id).has_value();
}