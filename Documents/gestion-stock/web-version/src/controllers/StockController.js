const StockService = require('../services/StockService');
const RapportService = require('../services/RapportService');

class StockController {
    constructor() {
        this.stockService = new StockService();
        this.rapportService = new RapportService(this.stockService);
    }

    // Page d'accueil
    index(req, res) {
        const stats = this.rapportService.getStatistiques();
        const produits = this.stockService.getAllProduits();
        const mouvements = this.stockService.getDerniersMouvements(5);
        
        res.render('index', {
            title: 'Accueil - Gestion de Stock',
            stats,
            produits,
            mouvements,
            alertes: this.stockService.getStockInsuffisant()
        });
    }

    // Liste des produits
    listeProduits(req, res) {
        const produits = this.stockService.getAllProduits();
        const categories = this.stockService.getCategories();
        const categorieFiltre = req.query.categorie || 'toutes';
        
        let produitsFiltres = produits;
        if (categorieFiltre !== 'toutes') {
            produitsFiltres = this.stockService.getProduitsParCategorie(categorieFiltre);
        }

        res.render('produits/liste', {
            title: 'Liste des produits',
            produits: produitsFiltres,
            categories,
            categorieFiltre
        });
    }

    // Ajouter un produit
    afficherAjouterProduit(req, res) {
        res.render('produits/ajouter', {
            title: 'Ajouter un produit',
            categories: this.stockService.getCategories(),
            erreur: null
        });
    }

    ajouterProduit(req, res) {
        const { nom, description, prix, quantite, categorieId, seuilAlerte } = req.body;
        
        const produit = this.stockService.creerProduit(
            nom,
            description,
            parseFloat(prix),
            parseInt(quantite),
            categorieId,
            parseInt(seuilAlerte)
        );

        if (produit) {
            res.redirect('/produits');
        } else {
            res.render('produits/ajouter', {
                title: 'Ajouter un produit',
                categories: this.stockService.getCategories(),
                erreur: 'Catégorie invalide ou erreur lors de la création'
            });
        }
    }

    // Modifier un produit
    afficherModifierProduit(req, res) {
        const produit = this.stockService.getProduit(req.params.id);
        if (!produit) {
            return res.redirect('/produits');
        }
        res.render('produits/modifier', {
            title: 'Modifier un produit',
            produit,
            categories: this.stockService.getCategories()
        });
    }

    modifierProduit(req, res) {
        const { nom, description, prix, quantite, categorieId, seuilAlerte } = req.body;
        const produit = this.stockService.getProduit(req.params.id);
        
        if (!produit) {
            return res.redirect('/produits');
        }

        produit.nom = nom || produit.nom;
        produit.description = description || produit.description;
        produit.prix = prix ? parseFloat(prix) : produit.prix;
        produit.quantite = quantite ? parseInt(quantite) : produit.quantite;
        produit.categorieId = categorieId || produit.categorieId;
        produit.seuilAlerte = seuilAlerte ? parseInt(seuilAlerte) : produit.seuilAlerte;

        this.stockService.mettreAJourProduitComplet(produit);
        res.redirect('/produits');
    }

    // Supprimer un produit
    supprimerProduit(req, res) {
        this.stockService.supprimerProduit(req.params.id);
        res.redirect('/produits');
    }

    // Mouvements
    listeMouvements(req, res) {
        const mouvements = this.stockService.getDerniersMouvements(100);
        res.render('mouvements/liste', {
            title: 'Historique des mouvements',
            mouvements,
            produits: this.stockService.getAllProduits()
        });
    }

    afficherEntree(req, res) {
        res.render('mouvements/entree', {
            title: 'Enregistrer une entrée',
            produits: this.stockService.getAllProduits(),
            erreur: null
        });
    }

    enregistrerEntree(req, res) {
        const { produitId, quantite, commentaire } = req.body;
        
        const result = this.stockService.enregistrerEntree(
            produitId,
            parseInt(quantite),
            commentaire || 'Entrée de stock'
        );

        if (result) {
            res.redirect('/mouvements');
        } else {
            res.render('mouvements/entree', {
                title: 'Enregistrer une entrée',
                produits: this.stockService.getAllProduits(),
                erreur: 'Produit non trouvé'
            });
        }
    }

    afficherSortie(req, res) {
        res.render('mouvements/sortie', {
            title: 'Enregistrer une sortie',
            produits: this.stockService.getAllProduits(),
            erreur: null
        });
    }

    enregistrerSortie(req, res) {
        const { produitId, quantite, commentaire } = req.body;
        
        const result = this.stockService.enregistrerSortie(
            produitId,
            parseInt(quantite),
            commentaire || 'Sortie de stock'
        );

        if (result) {
            res.redirect('/mouvements');
        } else {
            res.render('mouvements/sortie', {
                title: 'Enregistrer une sortie',
                produits: this.stockService.getAllProduits(),
                erreur: 'Produit non trouvé ou stock insuffisant'
            });
        }
    }

    afficherAjustement(req, res) {
        res.render('mouvements/ajustement', {
            title: 'Ajuster le stock',
            produits: this.stockService.getAllProduits(),
            erreur: null
        });
    }

    enregistrerAjustement(req, res) {
        const { produitId, nouvelleQuantite, commentaire } = req.body;
        
        const result = this.stockService.enregistrerAjustement(
            produitId,
            parseInt(nouvelleQuantite),
            commentaire || 'Ajustement de stock'
        );

        if (result) {
            res.redirect('/mouvements');
        } else {
            res.render('mouvements/ajustement', {
                title: 'Ajuster le stock',
                produits: this.stockService.getAllProduits(),
                erreur: 'Produit non trouvé'
            });
        }
    }

    // Rapports
    rapports(req, res) {
        const rapport = this.rapportService.genererRapportComplet();
        const statistiques = this.rapportService.getStatistiques();
        
        res.render('rapports/index', {
            title: 'Rapports',
            rapport,
            statistiques,
            categories: this.stockService.getCategories()
        });
    }
}

module.exports = StockController;