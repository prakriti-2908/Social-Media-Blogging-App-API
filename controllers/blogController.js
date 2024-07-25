const blogDataValidation = require("../utils/blogDataValidation");
const {
    createBlogModel,
    deleteBlogModel,
    getBlogsModel,
    getMyBlogsModel,
    getBlogByIdModel,
    editBlogModel,
    trashedBlogModel, 
} = require("../models/blogModel");


const createBlogController = async (req,res)=>{
    const {title,textBody} = req.body;
    // console.log(title,textBody);


    // blog data validation
    try{
        await blogDataValidation({title,textBody});
    }catch(err){
        return res.send({
            status:400,
            message:"Invalid Blog Data",
            error : err.toString(),
        });
    };
    
    
    
    // create blog schema and store in model
    try{
        const userId = req.session.user.userId;
        const blogData = await createBlogModel({title,textBody,userId});
        return res.send({
            status:201,
            message:"Blog has been saved in DB",
            blogData,
        });
    }catch(err){
        return res.send({
            status:500,
            message:"Internal Server Error",
            error : err,
        })
    }

};


const deleteBlogController = async (req,res)=>{
    const {blogId} = req.body;
    const userId = req.session.user.userId;
    if(!blogId){
        return res.send({
            status:400,
            message:"No blog Id is provided"
        })
    }

    // ownership check
    try {
        const blogDb = await getBlogByIdModel({editId:blogId});
        // console.log(userId.toString(),blogDb.userId.toString());
        if(blogDb.userId.toString() !== userId.toString()){
            return res.send({
                status:403,
                message:"Forbidden request",
                error:"you are not allowed to use this feature on someone else's blog",
            })
        }
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error in ownership",
            error : error.toString(),
        })
    }

    try{
        const deletedBlog = await deleteBlogModel({blogId});
        return res.send({
            status:200,
            message:"Blog is being moved to trash",
            deletedBlog,
        })
    }catch(err){
        return res.send({
            status:500,
            message:"Internal Server Error in trash move",
            error:err.toString(),
        })
    }
}

const getAllBlogsController = async (req,res) => {

    const SKIP = Number(req.query.skip) || 0;

    try {
        const blogDb = await getBlogsModel({SKIP});
        
        return res.send({
            status:200,
            message:"Blogs has been fetched successfully",
            allBlogs : blogDb,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }


}

const getMyBlogsController = async (req,res) => {
    const userId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;

    try {
        const blogDb = await getMyBlogsModel({userId,SKIP});

        return res.send({
            status:200,
            message:`Blogs has been fetched successfully for userId ${userId}`,
            blogs : blogDb,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}

const editBlogController = async (req,res) => {
    const {title,textBody,editId} = req.body;
    // console.log(title,textBody,editId);
    const userId = req.session.user.userId;
    // console.log("UserID: ",userId);


    // data validation
    try {
        blogDataValidation({title,textBody});
    } catch (error) {
        return res.send({
            status:400,
            message:"Invalid blog data",
            error:error.toString(),
        })
    }

    // ownership check
    try {
        const blogDb = await getBlogByIdModel({editId});
        // comparing password
        if(userId.toString()!==blogDb.userId.toString()){
            return res.send({
                status:403,
                message:"You are forbidden to access this feature of another user's blog",
            })
        }
        // 30 min 
        const diff = (Date.now()-blogDb.creationDateAndTime)/(1000*60);
        // console.log(diff);
        if(diff>30){
            return res.send({
                status:403,
                message:"You can't edit blog after 30 mins",
            })
        }
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }


    // editing
    try {
        const updatedBlog = await editBlogModel({title,textBody,editId});
        return res.send({
            status:201,
            message:"Blog has been updated successfully",
            "updated blog":updatedBlog,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}


const trashedBlogsController = async (req,res) => {

    const userId = req.session.user.userId;

    try {
        const trashedDb = await trashedBlogModel({userId});
        return res.send({
            status: 200,
            message:"Trashed Blogs are found",
            "trashed blogs":trashedDb,
        })
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal server error",
            error:error.toString(),
        })
    }

}

// exports
module.exports = {
    createBlogController,
    deleteBlogController,
    getAllBlogsController,
    getMyBlogsController,
    editBlogController,
    trashedBlogsController
};


