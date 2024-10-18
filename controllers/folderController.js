const db = require('../models');
const controller = {};

controller.fetchFolder = async(req, res) => {
    res.send(await db.Folder.findAll({
        include: [
            { model: db.User, as: 'user'}
        ]
    }) );
}

controller.fetchFolderid = async(req, res) => {
    let {id}=req.params;
    res.send(await db.Folder.findByPk(id,
      {
        include: [
          { model: db.User, as: 'user'}
      ]
      })
    );

}

controller.fetchFolderidSubfolders = async(req, res) => {
  let {id}=req.params;
  res.send(await db.Folder.findAll(
    {
      where:{
        parentId:id
      },
      include: [
        { model: db.User, as: 'user'}
    ]
    })
  );

}

controller.fetchFolderidFiles = async(req, res) => {
  let {id}=req.params;
  res.send(await db.File.findAll(
    {
      where:{
        idFolder:id
      }
    })
  );

}

controller.createFolder = async(req, res) => {
    console.log(req.body);
      try {
        // Extract the folder details from the request body
        const { foldername, parentId } = req.body;
        console.log(foldername, parentId);
       
    
        // Optionally, if a parent folder is provided, check if it exists
        let parentFolder = null;
        if (parentId) {
          parentFolder = await db.Folder.findOne({ where: { id: parentId } });
          if (!parentFolder) {
            return res.status(404).json({ error: 'Parent folder not found' });
          }
        }
    
        // Create a new folder, associating it with the user and potentially a parent folder
        const newFolder = await db.Folder.create({
          foldername,
          parentId: parentFolder ? parentFolder.id : null, 
          creationDate: new Date(), 
        });
    
        // Send back the newly created folder
        res.status(201).json(newFolder);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error, could not create folder' });
      }
}

controller.updateFolder = async(req, res) => {
    let {id} = req.params;
    let {idUser, foldername, length, numFiles} = req.body;
    let folder = await db.Folder.findByPk(id);
  
    if(folder)
    {
      let body = {};
      if(idUser!=undefined)
        body.idUser = idUser
      if(foldername!=undefined)
        body.foldername = foldername
      if(length!=undefined)
        body.length = length
      if(numFiles!=undefined)
        body.numFiles = numFiles
     
      folder.set(body);
      await user.save();
      res.send('updated successful')
    }
    else{
      res.send('unseccesful')
    }
}

controller.deleteFolder = async(req, res) => {
    let {id} = req.params;
    const folder = await db.Folder.findByPk(id,
      {
        include: [
          {model: db.File, as: 'files'}
        ]
      }
    );
    await folder.destroy();
}

// Create a subcategory that belongs to the parent category
// controller.createSubFolder = async(req, res) => {
//     const folder = await db.Folder.create({
//     idUser: req.body.idUser,
//     foldername: req.body.foldername,
//     idFolder: req.body.Folder.id,
//     length: req.body.length,
//     numFiles: req.body.numFiles,
//   })
//   res.send(folder);
// }

module.exports = controller;