const express = require('express');
const followRouter = express.Router();

// file imports
const { 
    followUserController,
    getFollowingListController,
    getFollowerListController,
    unfollowController,
} = require('../controllers/followController');



followRouter
            .post('/follow-user',followUserController)
            .post('/unfollow-user',unfollowController)
            .get('/following-list',getFollowingListController)
            .get('/follower-list',getFollowerListController)




module.exports = followRouter;