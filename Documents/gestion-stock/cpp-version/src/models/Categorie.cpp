#include "../../include/models/Categorie.hpp"

Categorie::Categorie() : id(""), nom(""), description("") {}

Categorie::Categorie(const std::string& id, const std::string& nom, const std::string& description)
    : id(id), nom(nom), description(description) {}

std::string Categorie::getId() const { return id; }
std::string Categorie::getNom() const { return nom; }
std::string Categorie::getDescription() const { return description; }

void Categorie::setNom(const std::string& nom) { this->nom = nom; }
void Categorie::setDescription(const std::string& description) { this->description = description; }

void Categorie::afficher() const {
    std::cout << "ID: " << id << " | Nom: " << nom << " | Desc: " << description << std::endl;
}
