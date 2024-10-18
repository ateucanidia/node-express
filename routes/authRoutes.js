const express = require('express');
const controller = require('./../controllers/authController');
const router = express.Router();

router.post('/sign-up', controller.resgisterUser);
router.post('/sign-in', controller.connectUser);
router.post('/fetchUser-data', controller.verifyTokenfetchUserData);

module.exports = router;