const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const db = require('../models');
const sequelize = require('../config/config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controller = {};
const fs = require('fs');
// const directoryPath = './newDirectory'
const directoryPath = './public'



controller.fetchUser = async(req, res) => {
    res.send(await db.User.findAll({
        // include: [
        //   { model: db.Folder, as: 'folders' }
        // ]
      }));
}

controller.fetchUserid = async(req, res) => {
    let {id}=req.params;
  res.send(await db.User.findByPk(id,
    {
    // include: [
    //   { model: db.Folder, as: 'folders' }
    // ]
    })
  );
  console.log(queryuser);
  res.send(queryuser);
}

controller.createUser = async(req, res) => {
    console.log(req.body);
 
    const { username, email, company, dateNaissance, numTelephone, photoProfil, password } = req.body;
    
       const hashedPassword =  await bcrypt.hash(password, 10);
    const user = await db.User.create({
    username,
    email,
    company,
    dateNaissance,
    numTelephone,
    photoProfil,  
    password: hashedPassword,
  });
  
  const folder = await db.Folder.create({
    foldername: 'root-folder-user-'+user.id,
    idUser: user.id
  });

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  if (!fs.existsSync(directoryPath+'/root-folder-user-'+user.id)) {
    fs.mkdirSync(directoryPath+'/root-folder-user-'+user.id);
    console.log(`Directory ${directoryPath}/root-folder-user-${user.id} created.`);
  }
    user.set({rootFolder:directoryPath+'/root-folder-user-'+user.id});
    await user.save();
  res.send(user);
}

controller.updateUser = async(req, res) => {
    let {id} = req.params;
  let {username, email, dateNaissance, numTelephone, photoProfil, password} = req.body;
  let user = await db.User.findByPk(id);

  if(user)
  {
    let body = {};
    if(username!=undefined)
      body.username = username
    if(email!=undefined)
      body.email = email
    if(dateNaissance!=undefined)
      body.dateNaissance = dateNaissance           
    if(numTelephone!=undefined)
      body.numTelephone = numTelephone
    if(photoProfil!=undefined)
      body.photoProfil = photoProfil
    if(password!=undefined)
      body.password = password
    user.set(body);
    await user.save();
    res.send('updated successful')
  }
  else{
    res.send('unseccesful')
  }
}

controller.deleteUser = async(req, res) => {
    let {id} = req.params;
    const user = await db.User.findByPk(id,
      {
        include: [
          {model: db.Folder, as: 'folders'}
        ]
      }
    );
    await user.destroy();zé
}

module.exports = controller;