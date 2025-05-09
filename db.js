const { Sequelize, DataTypes } = require('sequelize');

global.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
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
require('./models/SharedList')

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASSWORD, 
//     database: process.env.DB_NAME
// });

// module.exports = pool.promise();