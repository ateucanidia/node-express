const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const sequelize = require('./config/config.json');
const db = require('./models');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use(express.static(path.join(__dirname, './public')));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use('/api',authRoutes);
app.use('/api',folderRoutes);
app.use('/api',fileRoutes);
app.use('/api',userRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

// // Définir une route pour accéder aux données de la bd
// app.get('/api/users', async (req, res) => {
//   res.send(await db.User.findAll({
//     include: [
//       { model: db.Folder, as: 'folders' }
//     ]
//   }));
// }); 

// // Définir une route pour accéder à un utilisateur via un id precise
// app.get('/api/user/:id', async (req, res) => {
//   let {id}=req.params;
//   res.send(await db.User.findByPk(id,
//     {
//     // include: [
//     //   { model: db.Folder, as: 'folders' }
//     // ]
//     })
//   );
//   console.log(queryuser);
//   res.send(queryuser);
// }); 




//   app.post('/register', async(req, res) => {
//       try{
//           const {username, email,password} = req.body;
//           const userExist = await db.User.findOne({
//               where: {email}
//           });
//           if (userExist) {
//               return res.status(400).send('email is already associated an account');
//           }
//           await db.User.create({
//             username,
//               email,
//               password: await bcrypt.hash(password, 15),
//           });
//           return res.status(200).send('Registration successful');
//       }
//       catch (err) {
//           return res.status(500).send('Error in registering user');
//       }
      
//   })
//   app.post('/login', async (req, res) => {
//     const{email, password} = req.body;
//    // try{
//         //const user = await db.User.findOne({where: {"email":email}});
//         const user = await db.User.findOne({where: {email}});
//         console.log(user);
//         if (!user) {
//             return res.status(404).json('Email not found');
//         }
//         // Verify password
//         const passwordValid = await bcrypt.compare(password,user.password);
//         if (!passwordValid) {
//             return res.status(404).json('Incorrect email and password combination');
//         }
//         // Generate JWT token
//         const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
//         res.status(200).send({
//             id: user.id,
//             email: user.email,
//             accessToken: token
//         });
        
//     //}
//     // catch (err) {
//     //     return res.status(500).send('Sign in error');
//     //}
//   });

//   //middleware route pour la verification de l'authentification d'un utilisateur
// app.get('/verifyTokenfetchUserData', async(req,res) => {
//   const authHeader = req.headers['authorization'];
  
//   const token = authHeader ? authHeader.split(' ')[1] : '';

//   if (!token) {
//     return res.json({ isAuthenticated: false, userExists: false });
//   }

//   try{
//     const verifyToken = await jwt.verify(token, 'your_secret_key');
//     const user = await db.User.findOne({where: {id: verifyToken.id} });

//     if (!user) {
//       return res.json({ isAuthenticated: true, userExists: false });
//     }

//     res.status(200).json({
//       isAuthenticated: true, 
//       userExists: true,
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       dateNaissance: user.dateNaissance,
//       numTelephone: user.numTelephone,
//       photoProfil: user.photoProfil,
//       password: user.password,
     
//     });
    
//   }catch(err)
//   {
//     console.log(err);
//     return res.json({ isAuthenticated: false, userExists: false });
//   }
  
//   const readGroup = [User.ROLES.MANAGER, User.ROLES.ADMIN];
//   const writeGroup = [User.ROLES.ADMIN];


// //middleware de Vérification des Permissions
// const auth = (options) => {
//   return async (req, res, next) => {
//     try {
//       const user = req.user;  
//       const targetUserId = req.params.id;

//       // Verify that the target user exists
//       const targetUser = await User.findByPk(targetUserId); 
//       if (!targetUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Check user permissions
//       if (options.allowedGroup.includes(user.role)) {
//         return next();
//       } else {
//         return res.status(403).json({ message: 'Access denied: insufficient permissions' });
//       }
//     } catch (err) {
//       next(err);
//     }
//   };
// };

 
//   app.get('/user/:id', auth({ allowedGroup: readGroup }), asyncHandler(async(req, res) => {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     res.status(200).json(user);
//   }));
//   app.post('/user/:id', auth({ allowedGroup: writeGroup }), asyncHandler(async(req, res) => {
//     const userId = req.params.id;
//     const updatedData = req.body;
//     const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
//     res.status(200).json(user);
// }));
//   // if (err) return res.sendStatus(403);

//   //   req.user = user;
//   //   next();

// //   const user = await db.User.findOne({
// //     where: {id: req.user.id},
// //     attributes: {
// //         exclude: ['password']
// //     }
// //  });

// // res.send(user);

// });




module.exports = app;