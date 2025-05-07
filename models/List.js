const { DataTypes, Model } = require('sequelize')

const list = sequelize.define(
    'list',
    {
        name: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
)

list.sync();
console.log('synced')