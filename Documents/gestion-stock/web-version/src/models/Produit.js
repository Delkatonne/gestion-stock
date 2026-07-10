class Produit {
    constructor(id, nom, description, prix, quantite, categorieId, seuilAlerte) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.quantite = quantite;
        this.categorieId = categorieId;
        this.seuilAlerte = seuilAlerte;
    }

    estEnStockInsuffisant() {
        return this.quantite <= this.seuilAlerte;
    }

    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            description: this.description,
            prix: this.prix,
            quantite: this.quantite,
            categorieId: this.categorieId,
            seuilAlerte: this.seuilAlerte,
            stockInsuffisant: this.estEnStockInsuffisant()
        };
    }
}

module.exports = Produit;