#include "../../include/repository/ProduitRepository.hpp"
#include <algorithm>

void ProduitRepository::save(const Produit& produit) {
    produits[produit.getId()] = produit;
    produitsParCategorie[produit.getCategorieId()].push_back(produit.getId());
}

std::optional<Produit> ProduitRepository::findById(const std::string& id) const {
    auto it = produits.find(id);
    if (it != produits.end()) {
        return it->second;
    }
    return std::nullopt;
}

std::vector<Produit> ProduitRepository::findAll() const {
    std::vector<Produit> result;
    result.reserve(produits.size());
    for (const auto& pair : produits) {
        result.push_back(pair.second);
    }
    return result;
}

std::vector<Produit> ProduitRepository::findByCategorie(const std::string& categorieId) const {
    std::vector<Produit> result;
    auto it = produitsParCategorie.find(categorieId);
    if (it != produitsParCategorie.end()) {
        for (const auto& id : it->second) {
            auto produit = findById(id);
            if (produit.has_value()) {
                result.push_back(produit.value());
            }
        }
    }
    return result;
}

bool ProduitRepository::deleteById(const std::string& id) {
    auto produit = findById(id);
    if (!produit.has_value()) {
        return false;
    }
    
    // Supprimer de la catégorie
    auto& ids = produitsParCategorie[produit->getCategorieId()];
    ids.erase(std::remove(ids.begin(), ids.end(), id), ids.end());
    
    // Supprimer du map principal
    produits.erase(id);
    return true;
}

bool ProduitRepository::exists(const std::string& id) const {
    return produits.find(id) != produits.end();
}

std::vector<Produit> ProduitRepository::findEnStockInsuffisant() const {
    std::vector<Produit> result;
    for (const auto& pair : produits) {
        if (pair.second.estEnStockInsuffisant()) {
            result.push_back(pair.second);
        }
    }
    return result;
}

void ProduitRepository::clear() {
    produits.clear();
    produitsParCategorie.clear();
}

size_t ProduitRepository::size() const {
    return produits.size();
}