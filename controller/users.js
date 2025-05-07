const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - user
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

router.post("/login", async(req, res) => {
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

/**
 * @swagger
 * /user/register:
 *   post:
 *     description: adding a new user
 *     tags:
 *       - user
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
 *     responses:
 *       200:
 *         description: user registered
 */
router.post("/register", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        await db.query("INSERT INTO user(name, hashed_password) value (?, ?)", [username, password])
        res.status(200).json({ message: "User added succefuly"})
    } catch (err) {
        res.status(500).json({ erreur: err.message})
    }
}) 

/**
 * @openapi
 * /user/profile:
 *   get:
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get("/profile", middleWare ,async(req, res) => {
    // res.status(200).json({message: "e " + req.headers['authorization']})
    res.status(200).json({message: `connecté`, user: req.user})
    // res.status(200).json({message: jwt.verify(req.header("Authorization"), "your-secret-key")})
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

module.exports = {middleWare, router}