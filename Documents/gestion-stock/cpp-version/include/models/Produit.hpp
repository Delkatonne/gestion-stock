#ifndef PRODUIT_HPP
#define PRODUIT_HPP

#include <string>
#include <iostream>

class Produit {
private:
    std::string id;
    std::string nom;
    std::string description;
    double prix;
    int quantite;
    std::string categorieId;
    int seuilAlerte;

public:
    Produit();
    Produit(const std::string& id, const std::string& nom, const std::string& description,
            double prix, int quantite, const std::string& categorieId, int seuilAlerte);
    
    // Getters
    std::string getId() const;
    std::string getNom() const;
    std::string getDescription() const;
    double getPrix() const;
    int getQuantite() const;
    std::string getCategorieId() const;
    int getSeuilAlerte() const;
    
    // Setters
    void setNom(const std::string& nom);
    void setDescription(const std::string& description);
    void setPrix(double prix);
    void setQuantite(int quantite);
    void setCategorieId(const std::string& categorieId);
    void setSeuilAlerte(int seuilAlerte);
    
    bool estEnStockInsuffisant() const;
    void afficher() const;
    
    bool operator==(const Produit& autre) const;
};

#endif