# Système de Gestion de Stock

[![Version C++](https://img.shields.io/badge/C%2B%2B-17-blue.svg)](https://isocpp.org/)
[![Version Web](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-purple.svg)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Deux versions d'un système de gestion d'inventaire en temps réel : une version console en C++ et une version web avec Node.js/Express.

---

## 📁 Structure du projet
gestion-stock/
│
├── .gitignore
├── README.md
│
├── cpp-version/ # Version C++
│ ├── CMakeLists.txt
│ ├── build.bat
│ ├── build.sh
│ ├── include/
│ │ ├── models/
│ │ ├── repository/
│ │ ├── service/
│ │ └── ui/
│ ├── src/
│ │ ├── models/
│ │ ├── repository/
│ │ ├── service/
│ │ ├── ui/
│ │ └── main.cpp
│ └── data/
│
└── web-version/ # Version Web
├── render.yaml
├── vercel.json
├── .env.example
├── package.json
├── app.js
├── src/
│ ├── models/
│ ├── repositories/
│ ├── services/
│ └── controllers/
├── views/
│ ├── produits/
│ ├── mouvements/
│ └── rapports/
└── public/
├── css/
└── js/

text

---

## 🚀 Version C++

### Prérequis
- Compilateur C++ (g++ ou MinGW)
- Support C++17 ou C++11

### Compilation

**Windows (MinGW) :**
```bash
cd cpp-version
g++ -std=c++17 -Iinclude src/main.cpp src/models/*.cpp src/repository/*.cpp src/service/*.cpp src/ui/*.cpp -o gestion_stock.exe
gestion_stock.exe
Linux/Mac :

bash
cd cpp-version
g++ -std=c++17 -Iinclude src/main.cpp src/models/*.cpp src/repository/*.cpp src/service/*.cpp src/ui/*.cpp -o gestion_stock
./gestion_stock
Avec CMake :

bash
cd cpp-version
mkdir build && cd build
cmake ..
make
./gestion_stock
Fonctionnalités
✅ Gestion des produits (CRUD)

✅ Mouvements de stock (Entrées, Sorties, Ajustements)

✅ Historique des mouvements

✅ Alertes de stock insuffisant

✅ Rapports et statistiques

✅ Interface console interactive

🌐 Version Web
Prérequis
Node.js (v14+)

npm (v6+)

Installation et exécution
bash
cd web-version
npm install
npm start
Mode développement :

bash
npm run dev
L'application sera disponible sur : http://localhost:3000

Déploiement
Sur Vercel
bash
cd web-version
vercel --prod
Ou via l'interface web de Vercel en sélectionnant le dossier web-version.

Sur Render
Connectez votre repository GitHub à Render

Créez un Web Service

Configuration :

Root Directory : web-version

Build Command : npm install

Start Command : npm start

Fonctionnalités
✅ Dashboard avec statistiques en temps réel

✅ Interface responsive (Bootstrap 5)

✅ Gestion complète des produits

✅ Mouvements de stock

✅ Historique des mouvements

✅ Alertes de stock insuffisant

✅ Rapports détaillés

✅ Filtrage par catégorie

🏗️ Architecture
Couches
Modèles : Représentation des données (Produit, Categorie, MouvementStock)

Repositories : Gestion des données (CRUD)

Services : Logique métier

UI/Controllers : Interface utilisateur

Flux de données
text
[Interface Utilisateur] → [Contrôleurs] → [Services] → [Repositories] → [Données]
                                    ↓
                              [Modèles]
🛠️ Technologies
Version C++
C++17 / C++11

STL

CMake

Version Web
Node.js

Express.js

EJS

Bootstrap 5

UUID

📄 Licence
MIT - Libre d'utilisation et de modification.

🤝 Contribuer
Forker le projet

Créer une branche : git checkout -b feature/ma-fonctionnalite

Committer : git commit -m 'Ajout de ma fonctionnalité'

Pousser : git push origin feature/ma-fonctionnalite

Ouvrir une Pull Request