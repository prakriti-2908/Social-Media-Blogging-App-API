// package imports
const express = require('express');
const blogRouter = express.Router();


// file imports
const { 
    createBlogController, 
    deleteBlogController,
    getMyBlogsController,
    getAllBlogsController,
    editBlogController,
    trashedBlogsController,
    restoreBlogController, 
} = require('../controllers/blogController');


// routers
blogRouter
          .post('/create-blog',createBlogController)
          .post('/delete-blog',deleteBlogController)
          .post('/edit-blog',editBlogController)
          .post('/restore-blog',restoreBlogController)
          .get('/get-all-blogs',getAllBlogsController)
          .get('/get-my-blogs',getMyBlogsController)
          .get('/trashed-blogs',trashedBlogsController)
          








module.exports = blogRouter;