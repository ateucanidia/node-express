const multer = require("multer");
const jwt = require('jsonwebtoken');
const storage = {};
const db = require('./../models');

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/svg": "svg",
  };

storage.diskStorage = multer. diskStorage({
    destination: async(req, file,cb) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : '';5
        console.log('storqge middleware');
        try{
            const verifyToken = await jwt.verify(token, 'your_secret_key');
            const user = await db.User.findOne({where: {id: verifyToken.id} });
            cb(null, user.rootFolder);
        }catch(err)
        {
        cb(null, './public');
        }
        
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(" ").join("_");
        //const finalname = name.split(".")[0];
        const extension = MIME_TYPES[file.mimetype];
        cb(null, Date.now()+'_' + name );
    },
});

module.exports = multer({ storage: storage.diskStorage }).single("file");