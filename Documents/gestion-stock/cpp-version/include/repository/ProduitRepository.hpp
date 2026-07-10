#ifndef PRODUITREPOSITORY_HPP
#define PRODUITREPOSITORY_HPP

#include "../models/Produit.hpp"
#include <vector>
#include <unordered_map>
#include <memory>
#include <optional>

class ProduitRepository {
private:
    std::unordered_map<std::string, Produit> produits;
    std::unordered_map<std::string, std::vector<std::string>> produitsParCategorie;

public:
    ProduitRepository() = default;
    
    void save(const Produit& produit);
    std::optional<Produit> findById(const std::string& id) const;
    std::vector<Produit> findAll() const;
    std::vector<Produit> findByCategorie(const std::string& categorieId) const;
    bool deleteById(const std::string& id);
    bool exists(const std::string& id) const;
    std::vector<Produit> findEnStockInsuffisant() const;
    void clear();
    size_t size() const;
};

#endif