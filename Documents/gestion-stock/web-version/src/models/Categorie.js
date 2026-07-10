class Categorie {
    constructor(id, nom, description) {
        this.id = id;
        this.nom = nom;
        this.description = description;
    }

    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            description: this.description
        };
    }
}

module.exports = Categorie;