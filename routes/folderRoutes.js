const express = require('express');
const controller = require('./../controllers/folderController');
const router = express.Router();

router.get('/folders', controller.fetchFolder );
router.get('/folders/:id', controller.fetchFolderid);
router.get('/folders/:id/subfolders', controller.fetchFolderidSubfolders);
router.post('/folders', controller.createFolder);
// router.post('/sub-folders', controller.createSubFolder);
router.put('/folder/:id', controller.updateFolder);
router.delete('/folder', controller.deleteFolder);

module.exports = router;