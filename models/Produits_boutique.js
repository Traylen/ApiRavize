const { DataTypes, Model } = require('sequelize')

const produit = sequelize.define(
    'produit_boutique',
    {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        prix: {
            type: DataTypes.DECIMAL
        },
        category: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
)

produit.sync();
console.log('synced')