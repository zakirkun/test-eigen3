const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Borrow extends Model {}
Borrow.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code_book: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  code_member: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  borrow_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'NOT_RETURNED',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  modelName: 'Borrow',
  tableName: 'borrow',
  timestamps: false,
});

module.exports = Borrow;