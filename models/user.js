'use strict';
const { Model } = require('sequelize');
//const sequelize = require('../config/config.json');
const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
}

module.exports.ROLES = ROLES;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({Folder, AuthToken}) {
     this.hasMany(Folder, {foreignKey: 'idUser', as: 'folders'})
     this.hasMany(AuthToken, { foreignKey: 'idUser', as: 'authTokens' });
    }
    toJSON(){
      return { ...this.get(), idFolder: undefined, idToken: undefined}
    }

  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // permissions: DataTypes.ARRAY(DataTypes.STRING),
    company: DataTypes.STRING,
    dateNaissance: DataTypes.DATE,
    numTelephone: DataTypes.INTEGER,
    photoProfil: DataTypes.STRING,
    password: DataTypes.STRING,
    rootFolder:  {
      type: DataTypes.STRING,
      allowNull: true
    }
   }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
 