#include "../../include/models/MouvementStock.hpp"
#include <iomanip>
#include <sstream>

MouvementStock::MouvementStock() 
    : id(""), produitId(""), type(TypeMouvement::ENTREE), 
      quantite(0), date(std::time(nullptr)), commentaire("") {}

MouvementStock::MouvementStock(const std::string& id, const std::string& produitId, 
                               TypeMouvement type, int quantite, const std::string& commentaire)
    : id(id), produitId(produitId), type(type), quantite(quantite), 
      date(std::time(nullptr)), commentaire(commentaire) {}

std::string MouvementStock::getId() const { return id; }
std::string MouvementStock::getProduitId() const { return produitId; }
TypeMouvement MouvementStock::getType() const { return type; }
int MouvementStock::getQuantite() const { return quantite; }
std::time_t MouvementStock::getDate() const { return date; }
std::string MouvementStock::getCommentaire() const { return commentaire; }

void MouvementStock::setCommentaire(const std::string& commentaire) { 
    this->commentaire = commentaire; 
}

std::string MouvementStock::getDateStr() const {
    char buffer[26];
    ctime_s(buffer, sizeof(buffer), &date);
    std::string dateStr(buffer);
    dateStr.pop_back(); // Enlever le \n
    return dateStr;
}

void MouvementStock::afficher() const {
    std::cout << "ID: " << id << " | Produit: " << produitId 
              << " | Type: " << typeMouvementToString(type)
              << " | Qte: " << quantite 
              << " | Date: " << getDateStr()
              << " | Commentaire: " << commentaire << std::endl;
}