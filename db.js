const { Sequelize, DataTypes } = require('sequelize');

global.sequelize = new Sequelize('ravize', 'root', 'root', {
    host: '127.0.0.1',
    dialect: "mariadb"
})

async function connect() {
    try {
        await sequelize.authenticate()
        console.log("Orm connected to database")
    } catch (error) {
        console.log("error : " + error) 
    }
}

connect();
require('./models/User')
require('./models/Produits_boutique')
require('./models/List')

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASSWORD, 
//     database: process.env.DB_NAME
// });

// module.exports = pool.promise();