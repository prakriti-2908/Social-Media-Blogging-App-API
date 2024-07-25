const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
    follower:{
        type:String,
        required:true,
        ref:"User",
    },
    following:{
        type:String,
        required:true,
        ref:"User",
    },
    creationDateAndTime : {
        type : String,
        default:Date.now(),
    }
});

module.exports = mongoose.model('follow',followSchema);