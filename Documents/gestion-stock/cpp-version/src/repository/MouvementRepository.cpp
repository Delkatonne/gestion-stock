#include "../../include/repository/MouvementRepository.hpp"

void MouvementRepository::save(const MouvementStock& mouvement) {
    tousLesMouvements.push_back(mouvement);
    mouvementsParProduit[mouvement.getProduitId()].push_back(mouvement);
}

std::vector<MouvementStock> MouvementRepository::findByProduit(const std::string& produitId) const {
    auto it = mouvementsParProduit.find(produitId);
    if (it != mouvementsParProduit.end()) {
        return it->second;
    }
    return std::vector<MouvementStock>();
}

std::vector<MouvementStock> MouvementRepository::findAll() const {
    return tousLesMouvements;
}

std::vector<MouvementStock> MouvementRepository::findLastN(int n) const {
    std::vector<MouvementStock> result;
    int start = std::max(0, static_cast<int>(tousLesMouvements.size()) - n);
    for (int i = start; i < static_cast<int>(tousLesMouvements.size()); ++i) {
        result.push_back(tousLesMouvements[i]);
    }
    return result;
}

void MouvementRepository::clear() {
    tousLesMouvements.clear();
    mouvementsParProduit.clear();
}

size_t MouvementRepository::size() const {
    return tousLesMouvements.size();
}