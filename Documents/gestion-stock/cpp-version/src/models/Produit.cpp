#include "../../include/models/Produit.hpp"
#include <iomanip>

Produit::Produit() 
    : id(""), nom(""), description(""), prix(0.0), quantite(0), 
      categorieId(""), seuilAlerte(0) {}

Produit::Produit(const std::string& id, const std::string& nom, const std::string& description,
                double prix, int quantite, const std::string& categorieId, int seuilAlerte)
    : id(id), nom(nom), description(description), prix(prix), 
      quantite(quantite), categorieId(categorieId), seuilAlerte(seuilAlerte) {}

std::string Produit::getId() const { return id; }
std::string Produit::getNom() const { return nom; }
std::string Produit::getDescription() const { return description; }
double Produit::getPrix() const { return prix; }
int Produit::getQuantite() const { return quantite; }
std::string Produit::getCategorieId() const { return categorieId; }
int Produit::getSeuilAlerte() const { return seuilAlerte; }

void Produit::setNom(const std::string& nom) { this->nom = nom; }
void Produit::setDescription(const std::string& description) { this->description = description; }
void Produit::setPrix(double prix) { this->prix = prix; }
void Produit::setQuantite(int quantite) { this->quantite = quantite; }
void Produit::setCategorieId(const std::string& categorieId) { this->categorieId = categorieId; }
void Produit::setSeuilAlerte(int seuilAlerte) { this->seuilAlerte = seuilAlerte; }

bool Produit::estEnStockInsuffisant() const {
    return quantite <= seuilAlerte;
}

void Produit::afficher() const {
    std::cout << "ID: " << id << " | Nom: " << nom 
              << " | Qte: " << quantite << " | Prix: " << std::fixed << std::setprecision(2) << prix 
              << " | Seuil: " << seuilAlerte << std::endl;
}

bool Produit::operator==(const Produit& autre) const {
    return id == autre.id;
}