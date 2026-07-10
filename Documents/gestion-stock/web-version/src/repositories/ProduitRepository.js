class ProduitRepository {
    constructor() {
        this.produits = new Map();
        this.produitsParCategorie = new Map();
    }

    save(produit) {
        this.produits.set(produit.id, produit);
        if (!this.produitsParCategorie.has(produit.categorieId)) {
            this.produitsParCategorie.set(produit.categorieId, new Set());
        }
        this.produitsParCategorie.get(produit.categorieId).add(produit.id);
    }

    findById(id) {
        return this.produits.get(id) || null;
    }

    findAll() {
        return Array.from(this.produits.values());
    }

    findByCategorie(categorieId) {
        const ids = this.produitsParCategorie.get(categorieId) || new Set();
        return Array.from(ids).map(id => this.produits.get(id)).filter(Boolean);
    }

    deleteById(id) {
        const produit = this.produits.get(id);
        if (!produit) return false;
        
        const ids = this.produitsParCategorie.get(produit.categorieId);
        if (ids) ids.delete(id);
        
        this.produits.delete(id);
        return true;
    }

    exists(id) {
        return this.produits.has(id);
    }

    findEnStockInsuffisant() {
        return Array.from(this.produits.values()).filter(p => p.estEnStockInsuffisant());
    }

    clear() {
        this.produits.clear();
        this.produitsParCategorie.clear();
    }

    size() {
        return this.produits.size;
    }
}

module.exports = ProduitRepository;