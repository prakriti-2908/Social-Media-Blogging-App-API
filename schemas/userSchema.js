const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({

    followerCount:{
        type:Number,
        default:0,
    },

    followingCount:{
        type:Number,
        default:0,
    },


    name:{
        type : String,
    },
    username:{
        type:String,
        unique:true,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
})

module.exports = mongoose.model('User',user);