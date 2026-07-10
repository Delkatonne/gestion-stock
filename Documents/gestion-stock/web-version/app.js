const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');

const StockController = require('./src/controllers/StockController');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Initialisation du contrôleur
const stockController = new StockController();

// Routes principales
app.get('/', stockController.index.bind(stockController));

// Routes produits
app.get('/produits', stockController.listeProduits.bind(stockController));
app.get('/produits/ajouter', stockController.afficherAjouterProduit.bind(stockController));
app.post('/produits', stockController.ajouterProduit.bind(stockController));
app.get('/produits/:id/modifier', stockController.afficherModifierProduit.bind(stockController));
app.put('/produits/:id', stockController.modifierProduit.bind(stockController));
app.delete('/produits/:id', stockController.supprimerProduit.bind(stockController));

// Routes mouvements
app.get('/mouvements', stockController.listeMouvements.bind(stockController));
app.get('/mouvements/entree', stockController.afficherEntree.bind(stockController));
app.post('/mouvements/entree', stockController.enregistrerEntree.bind(stockController));
app.get('/mouvements/sortie', stockController.afficherSortie.bind(stockController));
app.post('/mouvements/sortie', stockController.enregistrerSortie.bind(stockController));
app.get('/mouvements/ajustement', stockController.afficherAjustement.bind(stockController));
app.post('/mouvements/ajustement', stockController.enregistrerAjustement.bind(stockController));

// Routes rapports
app.get('/rapports', stockController.rapports.bind(stockController));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;