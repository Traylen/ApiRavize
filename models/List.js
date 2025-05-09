const { DataTypes, Model } = require('sequelize')

global.list = sequelize.define(
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

module.exports = list