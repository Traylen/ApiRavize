const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc');

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
  apis: ['./app.js'], // files containing annotations as above
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)))

app.post("/user/register", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

    await db.query("INSERT INTO user(name, hashed_password) value (?, ?)", [username, password])
    } catch (err) {
        res.status(500).json({ erreur: err.message})
    }
}) 

/**
 * @swagger
 * /user/login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.post("/user/login", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        console.log(username)
        console.log(password);

        const [response] = await db.query("SELECT * from user where name = ? and hashed_password = ?", [username, password])

        if(response.length <= 0) return res.status(401).json({error: "user not find"})
 
        console.log(response[0].name)
        
        const token = jwt.sign({ userId: response[0].id, name: response[0].name }, 'your-secret-key', {expiresIn: '1800s'});

        res.json({token})
    } catch (err) {
        res.status(500).json({ erreur: err.message})
    }
})

function middleWare(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

      if (token == null) return res.sendStatus(401)

      jwt.verify(token, "your-secret-key", (err, user) => {
        console.log(user)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

/**
 * @openapi
 * /user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get("/user/profile", middleWare ,async(req, res) => {
    // res.status(200).json({message: "e " + req.headers['authorization']})
    res.status(200).json({message: `connecté`, user: req.user})
    // res.status(200).json({message: jwt.verify(req.header("Authorization"), "your-secret-key")})
})

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
