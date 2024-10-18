const express = require('express');
const controller = require('./../controllers/userController');
const router = express.Router();

router.get('/users', controller.fetchUser );
router.post('/users', controller.createUser);
router.get('/users/:id', controller.fetchUserid);

router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

module.exports = router;