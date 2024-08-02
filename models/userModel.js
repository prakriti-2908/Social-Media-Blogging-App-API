const userSchema = require("../schemas/userSchema");
const blogSchema = require("../schemas/blogSchema");

const getUserInfoModel = ({userID}) => {
    return new Promise(async (resolve,reject)=>{
        try {
            // console.log(userID);
            const userDb = await userSchema.findOne({_id:userID});
            resolve(userDb);
        } catch (error) {
            reject(error);
        }
    })
};


const dltUserModel = ({userId}) => {
    return new Promise( async (resolve,reject)=>{
        try {
            const userDb = await userSchema.findOneAndDelete({_id:userId});
            await blogSchema.deleteMany({userId:userId});
            if(!userDb){
                resolve("User not found");
            }
            resolve(userDb);
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    getUserInfoModel,
    dltUserModel,
};