const db = require('./../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controller = {};
const fs = require('fs');
const directoryPath = './public'


controller.resgisterUser = async(req,res) => {
    // try{
        const {username, email, company, dateNaissance, numTelephone, photoProfil, password} = req.body;
        
        const userExist = await db.User.findOne({
            where: {email}
        });
        if (userExist) {
            return res.status(400).send('email is already associated an account');
        }
        const user = await db.User.create({
            username,
            email,
            company,
            dateNaissance,
            numTelephone,
            photoProfil,  
            password: await bcrypt.hash(password, 10),
        });
        console.log('resgisterUser');
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
     
    return res.status(200).send('Registration successful');
}

controller.connectUser = async(req, res) => {
    const{email, password} = req.body;
    console.log(email,password,req.body);
    try{
        
        const user = await db.User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json('Email not found');
        }
        // Verify password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(404).json('Incorrect email and password combination');
        }
        // Authenticate user with jwt
        const token = jwt.sign({ id: user.id }, 'your_secret_key', {
            expiresIn: '2h'
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: token
        })

    }
    catch (err) {
        return res.status(500).send('Sign in error');
    }
}

controller.verifyTokenfetchUserData = async(req, res) => {
    const authHeader = req.headers['authorization'];
  
  const token = authHeader ? authHeader.split(' ')[1] : '';

  if (!token) {
    return res.json({ isAuthenticated: false, userExists: false });
  }

  try{
    const verifyToken = await jwt.verify(token, 'your_secret_key');
    const user = await db.User.findOne({where: {id: verifyToken.id} });

    if (!user) {
      return res.json({ isAuthenticated: true, userExists: false });
    }

    res.status(200).json({
      isAuthenticated: true, 
      userExists: true,
      id: user.id,
      username: user.username,
      email: user.email,
      dateNaissance: user.dateNaissance,
      numTelephone: user.numTelephone,
      photoProfil: user.photoProfil,
      password: user.password,
     
    });
    
  }catch(err)
  {
    console.log(err);
    return res.json({ isAuthenticated: false, userExists: false });
  }
}

module.exports = controller;