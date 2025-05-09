const { DataTypes } = require('sequelize');

global.shardedList = sequelize.define(
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
  through: SharedList,
  foreignKey: 'user_id',
  otherKey: 'list_id',
  as: 'sharedLists'
});

List.belongsToMany(User, {
  through: SharedList,
  foreignKey: 'list_id',
  otherKey: 'user_id',
  as: 'sharedUsers'
});

SharedList.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SharedList.belongsTo(List, { foreignKey: 'list_id', onDelete: 'CASCADE' });

shardedList.sync();
console.log('synced')