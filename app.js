const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/produits', async (req, res) => {
    try {
        const [produits] = await db.query('SELECT * FROM produits_boutique');
        res.json(produits);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

app.get('/api/produits/:id', async (req, res) => {
    try {
        const [produit] = await db.query('SELECT * FROM produits_boutique WHERE id = ?', [req.params.id]);

        if (produit.length === 0) {
            return res.status(404).json({ erreur: "Produit non trouvé." });
        }

        res.json(produit[0])
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

app.get('/api/produits/categorie/:categorie', async (req, res) => {
    try {
        const categorie = req.params.categorie;
        const [produits] = await db.query(
            'SELECT * FROM produits_boutique WHERE categorie = ?',
            [categorie]
        );

        if (produits.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé dans cette catégorie." });
        }

        res.json(produits);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API REST en écoute sur http://localhost:${PORT}`);
});
