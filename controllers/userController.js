const { getUserInfoModel, dltUserModel } = require("../models/userModel");

const getUserInfo = async (req,res) => {
    const userID = req.session.user.userId;
    // console.log(userID);
    try {
        // res.send("hehe");
        const userDb = await getUserInfoModel({userID});
        res.send({
            status:200,
            userInfo: userDb,
        });
    } catch (error) {
        res.send(error);
    }
}


const dltUserController = async (req,res) => {
    const userId = req.session.user.userId;
    try {
        const userDb = await dltUserModel({userId});
        res.send({
            status:200,
            message:"User is deleted successfully",
            deletedUser:userDb,
        })
    } catch (error) {
        res.send({
            status:500,
            message:"Internal Server Error",
            Error:error,
        })
    }
}

module.exports = {
    getUserInfo,
    dltUserController,

};