# Delka Médias Gestion

Application de gestion de médias (photos, vidéos, documents) avec authentification Gmail.

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/context/` — AuthContext, MediaContext (état global)
- `src/utils/` — données mock, helpers
- `src/styles/` — CSS (auth, dashboard, global)
- `src/components/` — composants réutilisables
- `src/pages/` — écrans (Login, Register, Reset, Dashboard)
- `src/App.jsx` — routeur principal
