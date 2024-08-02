// external imports
const bcrypt = require('bcryptjs');
const clc = require('cli-color');
const userDataValidation = require('../utils/userDataValidation.js');

// file imports
const User = require('../models/authModel.js');
const { findUserWithKey } = require('../models/authModel.js');
const sessionSchema = require('../schemas/sessionSchema.js');


// auth controllers
loginController = async (req,res)=>{
    // console.log(clc.whiteBright("Login api working fine"));
    const {loginId,password} = req.body;

    if(!loginId || !password){
        return res.send({
            status:400,
            message:"Missing users credential",
        })
    }

    try{
        // find user
        const userDb = await findUserWithKey({key:loginId});

        // compare password
        const isMatch = await bcrypt.compare(password,userDb.password);
        if(!isMatch){
            return res.send({
                status:400,
                message:"Incorrect Password",
            })
        }

        // session based authentication 
        req.session.isAuth = true;
        req.session.user = {
            username : userDb.username,
            email : userDb.email,
            userId : userDb._id,
        }

        return res.send({
            status: 200,
            message : "User Logged In Successfully",
            data : userDb,
        })
    }catch(err){
        return res.send({
            status:500,
            message:"Internal Server Error",
            error: err.toString()
        })
    }

}

registerController = async (req,res)=>{
    // console.log(clc.whiteBright("Register api working fine"));
    const {name,email,username,password} = req.body;

    // data validation
    try{
        await userDataValidation({name,email,password,username});
    }catch(err){
        console.log(clc.redBright(err));
        return res.send({
            status:400,
            message:"Data invalid",
            error:err, 
        })
    }


    // store data in db
    const obj = new User({name,email,password,username});
    try{
        const userDb = await obj.registerUser();
        return res.send({
            status:201,
            message:"User stored in DB successfully",
            data:userDb,
        })
    }catch(error){
        return res.send({
            status:500,
            message:"Internal Server Error",
            Error:error.toString(),
        })
    }

}


logoutController = (req,res)=>{

    req.session.destroy((err)=>{
        if(err){
            return res.send({
                status: 500,
                message: "Internal server error",
                error : err.toString(),
            });
        }
        return res.send({
            status:200,
            message : "User has been successfully logged out from this device only"
        })
    })


}

logoutFromAllDevicesController = async (req,res)=>{
    try{
        const userId = req.session.user.userId;
        //console.log(userId);
        const deletedSessions = await sessionSchema.deleteMany({"session.user.userId":userId});
        //console.log(deletedSessions);
        return res.send({
            status:200,
            message:`Logout from ${deletedSessions.deletedCount} device(s) has been successfully done`,
    })
    }catch(err){
        return res.send({
            status:500,
            message:"Internal server error",
            error:err.toString()
        });
    }
}


// exports
module.exports = {loginController,registerController,logoutController,logoutFromAllDevicesController};