const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const MouvementStock = require('../models/MouvementStock');
const ProduitRepository = require('../repositories/ProduitRepository');
const MouvementRepository = require('../repositories/MouvementRepository');
const { v4: uuidv4 } = require('uuid');

class StockService {
    constructor() {
        this.produitRepo = new ProduitRepository();
        this.mouvementRepo = new MouvementRepository();
        this.categories = [];
        this.initCategories();
    }

    initCategories() {
        this.categories = [
            new Categorie('CAT1', 'Électronique', 'Produits électroniques'),
            new Categorie('CAT2', 'Alimentaire', 'Produits alimentaires'),
            new Categorie('CAT3', 'Vêtements', 'Vêtements et accessoires'),
            new Categorie('CAT4', 'Mobilier', 'Mobilier et décoration')
        ];
    }

    genererId() {
        return uuidv4().substring(0, 8).toUpperCase();
    }

    // Gestion des produits
    creerProduit(nom, description, prix, quantite, categorieId, seuilAlerte) {
        if (!this.categorieExiste(categorieId)) {
            return null;
        }

        const id = this.genererId();
        const produit = new Produit(id, nom, description, prix, quantite, categorieId, seuilAlerte);
        this.produitRepo.save(produit);
        return produit;
    }

    getProduit(id) {
        return this.produitRepo.findById(id);
    }

    getAllProduits() {
        return this.produitRepo.findAll();
    }

    getProduitsParCategorie(categorieId) {
        return this.produitRepo.findByCategorie(categorieId);
    }

    supprimerProduit(id) {
        return this.produitRepo.deleteById(id);
    }

    mettreAJourProduit(id, nouvelleQuantite) {
        const produit = this.produitRepo.findById(id);
        if (!produit) return false;
        produit.quantite = nouvelleQuantite;
        this.produitRepo.save(produit);
        return true;
    }

    mettreAJourProduitComplet(produit) {
        if (!this.produitRepo.exists(produit.id)) return false;
        this.produitRepo.save(produit);
        return true;
    }

    // Gestion des mouvements
    enregistrerEntree(produitId, quantite, commentaire) {
        const produit = this.produitRepo.findById(produitId);
        if (!produit) return false;

        produit.quantite += quantite;
        this.produitRepo.save(produit);

        const mouvement = new MouvementStock(
            this.genererId(),
            produitId,
            'ENTREE',
            quantite,
            commentaire
        );
        this.mouvementRepo.save(mouvement);
        return true;
    }

    enregistrerSortie(produitId, quantite, commentaire) {
        const produit = this.produitRepo.findById(produitId);
        if (!produit) return false;
        if (produit.quantite < quantite) return false;

        produit.quantite -= quantite;
        this.produitRepo.save(produit);

        const mouvement = new MouvementStock(
            this.genererId(),
            produitId,
            'SORTIE',
            quantite,
            commentaire
        );
        this.mouvementRepo.save(mouvement);
        return true;
    }

    enregistrerAjustement(produitId, nouvelleQuantite, commentaire) {
        const produit = this.produitRepo.findById(produitId);
        if (!produit) return false;

        const ancienneQuantite = produit.quantite;
        produit.quantite = nouvelleQuantite;
        this.produitRepo.save(produit);

        const mouvement = new MouvementStock(
            this.genererId(),
            produitId,
            'AJUSTEMENT',
            nouvelleQuantite - ancienneQuantite,
            commentaire
        );
        this.mouvementRepo.save(mouvement);
        return true;
    }

    getMouvementsProduit(produitId) {
        return this.mouvementRepo.findByProduit(produitId);
    }

    getDerniersMouvements(n) {
        return this.mouvementRepo.findLastN(n);
    }

    getCategories() {
        return this.categories;
    }

    getCategorie(id) {
        return this.categories.find(c => c.id === id) || null;
    }

    categorieExiste(id) {
        return this.categories.some(c => c.id === id);
    }

    // Statistiques
    getValeurStock() {
        const produits = this.getAllProduits();
        return produits.reduce((total, p) => total + (p.prix * p.quantite), 0);
    }

    getNombreProduits() {
        return this.produitRepo.size();
    }

    getNombreMouvements() {
        return this.mouvementRepo.size();
    }

    getStockInsuffisant() {
        return this.produitRepo.findEnStockInsuffisant();
    }
}

module.exports = StockService;