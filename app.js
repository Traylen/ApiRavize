const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc');
global.app = express();
const {middleWare, router: userRoute} = require('./controller/users');

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ravize',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
  },
  apis: ['./app.js', './controller/*.js'], // files containing annotations as above
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)))
app.use("/user", userRoute)

/**
 * @swagger
 * /list/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: creating a new list
 */
app.post("/list/create", middleWare, async(req,res) => {

})

/**
 * @swagger
 * /api/produits:
 *   get:
 *     description: get all products in database
 *     tags:
 *       - products
 *     responses:
 *       200:
 *         description: return products in database     
 */
app.get('/api/produits', async (req, res) => {
    try {
        const [produits] = await db.query('SELECT * FROM produits_boutique');
        res.json(produits);
    } catch (err) {
        res.status(500).json({ erreur: err.message });
    }
});

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     description: Get a specific product from id
 *     tags:
 *       - products
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: product is returned
 */
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