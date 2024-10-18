'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    
    static associate({Folder}) {
      this.belongsTo(Folder,{foreignKey: 'idFolder', as: 'folders',
      });
    }
  }
  File.init({
    fileName: DataTypes.STRING,
    path: DataTypes.STRING,
    format: DataTypes.STRING,
    creationDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};