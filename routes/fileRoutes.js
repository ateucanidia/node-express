const express = require('express');
const controller = require('./../controllers/fileController');
const storage = require ('./../middleware/storage');
const authMiddleware = require('./../middleware/authMiddleware');
const router = express.Router();

router.get('/file', controller.fetchFile );
router.get('/file/:id', controller.fetchFileid);

router.post('/file',[
    authMiddleware.verifyToken,
    storage
],controller.createUploadFile);
router.put('/file/:id', controller.updateFile);
router.delete('/file/:id', controller.deleteFile);

module.exports = router;