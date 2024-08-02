const { LIMIT } = require("../pvtConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const addInFollowSchemaModel = ({followerUserId, followingUserId}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            
            // check if follower is already following him or not
            const isAlreadyFollowing = await followSchema.findOne({
                follower: followerUserId,
                following: followingUserId,
            });

            // console.log("is already followeing : ",isAlreadyFollowing);
            if(isAlreadyFollowing!==null){
                return reject("You are already following this user");
            }

            // creating folowObj
            const followObj = new followSchema({
                follower:followerUserId,
                following:followingUserId,
            });
            const followDb = await followObj.save();


            // increasing following and follower count
            await userSchema.findOneAndUpdate(
                { _id: followerUserId },
                { $inc: { followingCount: 1 } }
            );

            // Increase follower count for the user being followed
            await userSchema.findOneAndUpdate(
                { _id: followingUserId },
                { $inc: { followerCount: 1 } }
            );

            resolve(followDb);
        } catch (error) {
            reject(error);
        }
    })
}

const unfollowModel = ({ userId, unfollowId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const unfollowDb = await followSchema.findOneAndDelete({
                follower: userId,
                following: unfollowId,
            });

            if (!unfollowDb) {
                return reject(`No user found with unfollow id ${unfollowId}`);
            }

            // Decrease following count for the user
            await userSchema.findOneAndUpdate(
                { _id: userId },
                { $inc: { followingCount: -1 } }
            );

            // Decrease follower count for the user being unfollowed
            await userSchema.findOneAndUpdate(
                { _id: unfollowId },
                { $inc: { followerCount: -1 } }
            );

            resolve(unfollowDb);
        } catch (error) {
            reject(error);
        }
    });
};


const getFollowingListModel = ({userId, SKIP}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const followingDb = await followSchema
                .find({follower: userId})
                .populate('following')
                .sort({creationDateAndTime: -1})
                .skip(SKIP)
                .limit(LIMIT);

            

            if (!followingDb || followingDb.length === 0) {
                reject("You have not followed anyone yet");
            } else {
                resolve(followingDb);
            }
        } catch (error) {
            reject(error);
        }
    });
}


const getFollowerListModel = ({userId,SKIP}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const followerDb = await followSchema
                                                  .find({following:userId})
                                                  .populate('follower')
                                                  .sort({creationDateAndTime:-1})
                                                  .skip(SKIP)
                                                  .limit(LIMIT);

            if(followerDb.length==0 || !followerDb){reject("No follower found")};
            resolve(followerDb);
        } catch (error) {
            reject(error);
        }
    })
}

// exports
module.exports = {
    addInFollowSchemaModel,
    unfollowModel,
    getFollowingListModel,
    getFollowerListModel,

}