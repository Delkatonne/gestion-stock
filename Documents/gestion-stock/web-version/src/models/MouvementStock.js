class MouvementStock {
    constructor(id, produitId, type, quantite, commentaire) {
        this.id = id;
        this.produitId = produitId;
        this.type = type;
        this.quantite = quantite;
        this.date = new Date();
        this.commentaire = commentaire;
    }

    toJSON() {
        return {
            id: this.id,
            produitId: this.produitId,
            type: this.type,
            quantite: this.quantite,
            date: this.date,
            commentaire: this.commentaire,
            dateStr: this.getDateStr()
        };
    }

    getDateStr() {
        return this.date.toLocaleString('fr-FR');
    }
}

module.exports = MouvementStock;