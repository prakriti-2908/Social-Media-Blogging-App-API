const express = require('express');
const { getUserInfo, dltUserController } = require('../controllers/userController');
const { restoreBlogController } = require('../controllers/blogController');
const userRouter = express.Router();




userRouter
          .get('/user-info',getUserInfo)
          .post('/delete-user',dltUserController)
          .post('/restore-blog',restoreBlogController)


module.exports = userRouter;