'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require("uuid");


module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User,{foreignKey: 'idUser',as: 'user',
      });
    }
  }
  AuthToken.init({
    idUser: DataTypes.INTEGER,
    token: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AuthToken',
  });
  AuthToken.createToken = async function(user){
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);
    let _token = uuidv4();
    let refreshToken = await AuthToken.create({
      token: _token,
      idUser: db.User.id,
      expiryDate: expiredAt.getTime(),
    });
    return refreshToken.token;
  };
  AuthToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };
  return AuthToken;
};