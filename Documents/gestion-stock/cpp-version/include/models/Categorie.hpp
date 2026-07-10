#ifndef CATEGORIE_HPP
#define CATEGORIE_HPP

#include <string>
#include <iostream>

class Categorie {
private:
    std::string id;
    std::string nom;
    std::string description;

public:
    Categorie();
    Categorie(const std::string& id, const std::string& nom, const std::string& description);
    
    std::string getId() const;
    std::string getNom() const;
    std::string getDescription() const;
    
    void setNom(const std::string& nom);
    void setDescription(const std::string& description);
    
    void afficher() const;
};

#endif