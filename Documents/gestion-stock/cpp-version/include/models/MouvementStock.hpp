#ifndef MOUVEMENTSTOCK_HPP
#define MOUVEMENTSTOCK_HPP

#include "TypeMouvement.hpp"
#include <string>
#include <chrono>
#include <ctime>
#include <iostream>

class MouvementStock {
private:
    std::string id;
    std::string produitId;
    TypeMouvement type;
    int quantite;
    std::time_t date;
    std::string commentaire;

public:
    MouvementStock();
    MouvementStock(const std::string& id, const std::string& produitId, 
                   TypeMouvement type, int quantite, const std::string& commentaire);
    
    std::string getId() const;
    std::string getProduitId() const;
    TypeMouvement getType() const;
    int getQuantite() const;
    std::time_t getDate() const;
    std::string getCommentaire() const;
    
    void setCommentaire(const std::string& commentaire);
    
    void afficher() const;
    std::string getDateStr() const;
};

#endif