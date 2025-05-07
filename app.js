const express = require('express');
const cors = require('cors');
global.db = require('./db');
global. jwt = require('jsonwebtoken')
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: List created 
 */
app.post("/list/create", middleWare, async(req,res) => {
    try {
        if(req.user.userId == undefined || req.user.userId == null) throw Error('No user find');
        await list.create({name: req.body.name, user_id: req.user.userId});
        res.status(200).json({message: "List created succesfuly"})
    } catch (error) {
        res.status(500).json({message: error.message})   
    }
})

/**
 * @swagger
 * /list/delete/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: delete a list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: list deleted
 */
app.delete("/list/delete/:id", middleWare, async(req,res) => {
    try {
        const count = await list.destroy({where: {user_id: req.user.userId, id: req.params.id}})
        if(count == 0) return res.status(500).json({message: "Nothing was found"})
        res.status(200).json({message: "List deleted succefuly"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
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
        const produits = await produit.findAll({})
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
        const Cproduit = await produit.findAll({where: {id: req.params.id}})

        if (Cproduit.length === 0) {
            return res.status(404).json({ erreur: "Produit non trouvé." });
        }

        res.json(Cproduit[0])
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