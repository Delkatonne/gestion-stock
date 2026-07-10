class RapportService {
    constructor(stockService) {
        this.stockService = stockService;
    }

    genererRapportComplet() {
        const produits = this.stockService.getAllProduits();
        const mouvements = this.stockService.getDerniersMouvements(1000);
        const stockInsuffisant = this.stockService.getStockInsuffisant();
        const valeurStock = this.stockService.getValeurStock();

        return {
            produits,
            mouvements,
            stockInsuffisant,
            valeurStock,
            stats: {
                nombreProduits: produits.length,
                nombreMouvements: mouvements.length,
                valeurStock: valeurStock
            }
        };
    }

    getStatistiques() {
        const produits = this.stockService.getAllProduits();
        const categories = this.stockService.getCategories();
        const statsParCategorie = {};

        categories.forEach(cat => {
            const prods = this.stockService.getProduitsParCategorie(cat.id);
            statsParCategorie[cat.nom] = prods.length;
        });

        return {
            nombreProduits: produits.length,
            nombreMouvements: this.stockService.getNombreMouvements(),
            valeurStock: this.stockService.getValeurStock(),
            parCategorie: statsParCategorie,
            stockInsuffisant: this.stockService.getStockInsuffisant()
        };
    }
}

module.exports = RapportService;