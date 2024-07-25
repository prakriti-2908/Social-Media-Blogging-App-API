const { LIMIT } = require("../pvtConstants");
const blogSchema = require("../schemas/blogSchema");
const {ObjectId} = require('mongodb');

const createBlogModel = ({title,textBody,userId})=>{
    return new Promise(async(resolve,reject)=>{
        
        try{
            

            // check if title or textbody is copied or not
            const isExisting = await blogSchema.findOne({
                $or : [{title:title},{textBody:textBody}],
            });

            if(isExisting && isExisting.title == title){return reject("This title is already reserved for some other blog, Please choose another title")};
            if(isExisting && isExisting.textBody == textBody){return reject("Please be unique and write your own creative blog, don't copy others")};



            // create blog obj and save to blogs collection of mongoDB
            const blogObj = new blogSchema({
                title : title,
                textBody : textBody,
                creationDateAndTime : Date.now(),
                userId : userId
            });
            // console.log(blogObj);
            const blogDb = blogObj.save();
            resolve(blogDb);
            
        }catch(err){
            reject(err);
        }
    })
}


const deleteBlogModel = ({blogId}) => {
    return new Promise(async(resolve,reject)=>{
        try{
            // move blog to trash
            const query = ObjectId.isValid(blogId) ? { _id: blogId } : { title: blogId };
            const blogObj = await blogSchema.findOneAndUpdate(query, { isDeleted: true, deletionDateAndTime:Date.now() });
            // console.log(blogObj);
            if(!blogObj){
                return reject("Blog doesn't exist");
            }
            resolve(blogObj);
        }catch(err){
            reject(err);
        }
    })
}


const getBlogsModel =  ({SKIP}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const blogDb = await blogSchema.aggregate([
                {
                    $match : {isDeleted:{$ne:true}},
                },
                {
                    $sort : {creationDateAndTime : -1},
                },
                {
                    $skip : SKIP,
                },
                {
                    $limit : LIMIT,
                }
            ]);
            if(blogDb.length==0){
                reject("No more blogs");
            }
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    })
}

const getMyBlogsModel = ({SKIP,userId}) => {
    return new Promise(async (resolve,reject)=>{
        try {
            userId = userId.toString();
            const blogDb = await blogSchema.aggregate([
                {
                    $match : {userId : userId, isDeleted:{$ne:true}},
                },
                {
                    $skip : SKIP,
                },
                {
                    $limit:LIMIT,
                }
            ]);
            if(!blogDb || blogDb.length==0){return reject("Either you don't have created any blog yet or there are no more blogs of yours")}
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    })
}

const getBlogByIdModel = ({editId}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const query = ObjectId.isValid(editId) ? { _id: editId } : {title:editId};
            const blogDb = await blogSchema.findOne(query);
            if(!blogDb){reject("No blog found")};
            resolve(blogDb);
        } catch (error) {
            reject(error);
        }
    });
}

const editBlogModel = ({editId,title,textBody}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const updatedBlog = await blogSchema.findOneAndUpdate({_id:editId},{title:title , textBody:textBody,creationDateAndTime:Date.now()});
            resolve(updatedBlog);
        } catch (error) {
            reject(error);
        }
    })
}


const trashedBlogModel = ({userId}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const trashedDb = await blogSchema.find({userId:userId,isDeleted:true});
            if(!trashedDb){reject("No blog found in trash")};
            resolve(trashedDb);
        } catch (error) {
            reject(error);
        }
    })
}

// exports
module.exports = {
    createBlogModel, 
    deleteBlogModel,
    getBlogsModel,
    getMyBlogsModel,
    getBlogByIdModel,
    editBlogModel,
    trashedBlogModel
};