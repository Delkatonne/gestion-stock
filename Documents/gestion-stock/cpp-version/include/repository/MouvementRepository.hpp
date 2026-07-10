#ifndef MOUVEMENTREPOSITORY_HPP
#define MOUVEMENTREPOSITORY_HPP

#include "../models/MouvementStock.hpp"
#include <vector>
#include <unordered_map>
#include <algorithm>

class MouvementRepository {
private:
    std::vector<MouvementStock> tousLesMouvements;
    std::unordered_map<std::string, std::vector<MouvementStock>> mouvementsParProduit;

public:
    MouvementRepository() = default;
    
    void save(const MouvementStock& mouvement);
    std::vector<MouvementStock> findByProduit(const std::string& produitId) const;
    std::vector<MouvementStock> findAll() const;
    std::vector<MouvementStock> findLastN(int n) const;
    void clear();
    size_t size() const;
};

#endif