const { DataTypes } = require('sequelize');

global.sharedList = sequelize.define(
    'shared_list', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'shared_list'
});

const User = require('./User');
const List = require('./List');

User.belongsToMany(List, {
  through: sharedList,
  foreignKey: 'user_id',
  otherKey: 'list_id',
  as: 'sharedLists'
});

List.belongsToMany(User, {
  through: sharedList,
  foreignKey: 'list_id',
  otherKey: 'user_id',
  as: 'sharedUsers'
});

sharedList.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
sharedList.belongsTo(List, { foreignKey: 'list_id', onDelete: 'CASCADE' });

sharedList.sync();
console.log('synced')