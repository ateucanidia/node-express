const db = require('../models');
const controller = {};
const multer = require("multer")

//configuration de Multer avec diskStorage
const storage = multer. diskStorage({
    destination: (req, file,cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb (null, Date.now() + '-' + file.fieldname)
    },
  
  });
  const upload = multer ({ storage: storage }); 



controller.fetchFile = async(req, res) => {
    res.send(await db.File.findAll({
    
    }));
}

controller.fetchFileid = async(req, res) => {
    let {id}=req.params;
  res.send(await db.File.findByPk(id,
    {
     include: [
        {model: db.Folder, as: 'folders'} 
     ]
    })
    
  );
}

controller.createUploadFile = async(req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filerRecord = await db.File.create({
    fileName: req.file.filename,
    path: req.file.destination + '/'+req.file.filename ,
    format: req.file.mimetype ,
    creationDate: new Date(),
    idFolder: req.body.idFolder
  });
  
  res.status(200).json({
    message: 'File uploaded successfully',
    filerRecord: filerRecord,
    //file: req.file
  });
     
}

controller.updateFile = async(req, res) => {
    let {id}=req.params;
    let {idFolder, fileName, path, format} = req.body;
    let file = await db.File.findByPk(id,
        {
         include: [
            {model: db.Folder, as: 'folders'}
         ]
        });
    if(file)
      {
        let body = {};

        if(idFolder != undefined)
          body.idFolder = idFolder;
        if(fileName != undefined)
          body.fileName = fileName;
        if(format != undefined)
          body.format = format; 
        if(path != undefined)
          body.path = path; 
        file.set(body);
        await file.save();
        res.send('update sucessfully');
      }else
      res.send('not found');
}

controller.deleteFile = async(req, res) => {
    let {id} = req.params;
    const file = await db.File.findByPk(id,
      {
        include: [
          {model: db.Folder, as: 'folders'}
        ]
      }
    );
    await file.destroy();
    res.send('delete file sucessfully');
}

module.exports = controller;