const jwt = require("jsonwebtoken");
const db = require('./../models');
const controller = {};

controller.verifyToken = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("authorization", authHeader);
    const token = authHeader ? authHeader.split(' ')[1] : '';
    console.log("token", token);
    if (!token) {
        return res.status(401).send('Unautorization');
    }

  try{
    const verifyToken = await jwt.verify(token, 'your_secret_key');
    const user = await db.User.findOne({where: {id: verifyToken.id} });

    if (!user) {
        return res.status(401).send('Unautorization');
    }
    console.log("user", user);
    return next();
  }catch(err)
  {
    return res.status(401).send('Unautorization');
  }
}
module.exports = controller;