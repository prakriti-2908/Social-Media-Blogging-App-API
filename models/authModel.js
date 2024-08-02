const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

// file imports
const userSchema = require('../schemas/userSchema');

const User = class{
    constructor({name,email,username,password}){
        this.name = name;
        this.email = email;
        this.username=username;
        this.password=password;
    };

    registerUser() {
        return new Promise(async (resolve, reject) => {
          try {

            const userExist = await userSchema.findOne({
                $or:[{email:this.email},{username:this.username}],
            });

            if(userExist && userExist.email==this.email){reject("Email already Exist")};
            if(userExist && userExist.username==this.username){reject("Username already exist")};


            const hashedPassword = await bcrypt.hash(
              this.password,
              Number(process.env.SALT)
            );

            const userObj = new userSchema({
              name: this.name,
              email: this.email,
              password: hashedPassword,
              username: this.username,
            });

            const userDb = await userObj.save();
            resolve(userDb);
          } catch (error) {
            reject(error);
          }
        });
      }

      static findUserWithKey({key}) {
        return new Promise(async(resolve,reject)=>{
            try{
                const userDB = await userSchema.findOne({
                    $or : [ObjectId.isValid(key)?{_id:key}:{email:key},{username:key}],
                }).select("+password");
        
                if(!userDB) reject("User not found");
                resolve(userDB);
            }catch(err){
                reject(err)
            }
        })
      }
    
};

module.exports = User;