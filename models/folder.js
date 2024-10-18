'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    
    static associate({User, File, Folder}) {
      // define association here
      this.belongsTo(User,{foreignKey: 'idUser',as: 'user',});
      this.hasMany(File, {foreignKey: 'idFolder', as: 'file'}); 

      this.hasMany(Folder, {as: 'children', foreignKey: 'parentId'});
      this.belongsTo(Folder, {as: 'parent', foreignKey: 'parentId'});
    }
    toJSON() {
      return { ...this.get(), idUser: undefined, idFolder: undefined}
    }
  }

  Folder.init({
    foldername: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references:{
        model:'folders',
        key:'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
  }, {
    sequelize,
    modelName: 'Folder',
    tableName: 'folders'
  });

  return Folder;
};