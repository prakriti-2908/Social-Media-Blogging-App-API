const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blog = new Schema({
    title : {
        type:String,
        required:true,
        unique:true,
        minLength: 3,
        maxLength : 200,
        trim : true,
    },
    textBody : {
        type:String,
        required:true,
        unique:true,
        minLength : 10,
        maxLength : 3000,
        trim : true,
    },
    creationDateAndTime : {
        type : String,
    },
    userId : {
        type : String,
        required : true,
        ref : "User",
    },
    deletionDateAndTime:{
        type:String,
    },
    isDeleted:{
        type: Boolean,
        default:false,
    }
});

module.exports = mongoose.model('Blog',blog);