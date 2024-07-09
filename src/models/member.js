const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Member extends Model {}
Member.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  penalty_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  modelName: 'Member',
  tableName: 'members',
  timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
});

module.exports = Member;