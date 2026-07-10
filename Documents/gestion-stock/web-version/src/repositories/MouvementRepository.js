class MouvementRepository {
    constructor() {
        this.tousLesMouvements = [];
        this.mouvementsParProduit = new Map();
    }

    save(mouvement) {
        this.tousLesMouvements.push(mouvement);
        if (!this.mouvementsParProduit.has(mouvement.produitId)) {
            this.mouvementsParProduit.set(mouvement.produitId, []);
        }
        this.mouvementsParProduit.get(mouvement.produitId).push(mouvement);
    }

    findByProduit(produitId) {
        return this.mouvementsParProduit.get(produitId) || [];
    }

    findAll() {
        return this.tousLesMouvements;
    }

    findLastN(n) {
        const start = Math.max(0, this.tousLesMouvements.length - n);
        return this.tousLesMouvements.slice(start);
    }

    clear() {
        this.tousLesMouvements = [];
        this.mouvementsParProduit.clear();
    }

    size() {
        return this.tousLesMouvements.length;
    }
}

module.exports = MouvementRepository;