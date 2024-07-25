const { 
    addInFollowSchemaModel,
    getFollowingListModel,
    getFollowerListModel,
    unfollowModel,
} = require("../models/followModel");
const User = require("../models/userModel");


const followUserController = async (req,res) => {

    const{followingUserId} = req.body;
    const followerUserId = req.session.user.userId;

    if(!followerUserId || !followingUserId){
        return res.send({
            status:400,
            message:"Missing credentials",
        })
    }

    // ownershipCheck
    if(followerUserId.toString() === followingUserId.toString()){
        return res.send({
            status:400,
            message:"U can't follow yourself",
        })
    }

    // check if follower and following users are present in db or not
    try{
       await User.findUserWithKey({key:followerUserId});
    }catch(error){
        return res.send({
                status:400,
                message:"Follower user not found, please login again",
                error:error.toString(),
            })
    }

    try {
        await User.findUserWithKey({key:followingUserId});
    } catch (error) {
        return res.send({
            status:400,
            message:"Following user not found",
            error:error.toString(),
        })
    }


    try {

        const followDb = await addInFollowSchemaModel({followerUserId,followingUserId});

        return res.send({
            status:201,
            message:"Follow schema updated",
            "follow schema":followDb,
        })
        
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}

const getFollowingListController = async (req,res) => {
    const userId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;
    try {
        const followingDb = await getFollowingListModel({userId,SKIP});
        return res.send({
            status:200,
            message:"All data has been successfully fetched from db",
            followingDb,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }
}

const getFollowerListController = async (req,res) => {

    const userId = req.session.user.userId ;
    const SKIP = Number(req.query.skip) || 0;

    try {
        
        const followerDb = await getFollowerListModel({userId,SKIP});

        return res.send({
            status:200,
            message:"Follower list has been fatched successfully",
            followerDb,
        })

    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}


const unfollowController = async (req,res) => {
    const {unfollowId} = req.body;
    const userId = req.session.user.userId;

    try {
        const unfollowDb = await unfollowModel({unfollowId,userId});
        return res.send({
            status:200,
            message:"User unfollowed successfully",
            "unfollowed user":unfollowDb,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}

module.exports = {
    followUserController,
    getFollowingListController,
    getFollowerListController,
    unfollowController
}