const { DataTypes, Model } = require('sequelize')

global.user = sequelize.define(
    'user',
    {
        name: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
)

user.sync();
console.log('synced')