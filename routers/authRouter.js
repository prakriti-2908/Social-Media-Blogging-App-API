// external imports
const express = require('express');
const authRouter = express.Router();

// file imports
const isAuthMiddleware = require('../middlewares/isAuthMiddleware');
const { registerController, loginController, logoutController, logoutFromAllDevicesController } = require('../controllers/authController');


// auth routers
authRouter.post('/register',registerController);

authRouter.post('/login',loginController);

authRouter.post('/logout',isAuthMiddleware,logoutController);

authRouter.post('/logout_from_all_devices',isAuthMiddleware,logoutFromAllDevicesController)

module.exports = authRouter;