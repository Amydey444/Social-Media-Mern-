const HttpError=require('../models/errorModel')
const PostModel=require('../models/postModel')
const UserModel=require('../models/userModel')

const{v4:uuid} = require('uuid')
const cloudinary=require('../utils/cloudinary')
const fs = require('fs')
const path=require('path')
const postModel = require('../models/postModel')

//CREATE POST
//POST:api/posts
//PROTECTED

const createPost=async(req,res,next)=>{
    try{
        
        const {body}=req.body;
        if(!body){
            return next(new HttpError("Fill in text and choose image",422))
        }
        if(!req.files.image){
            return next(new HttpError("Please choose an image",422))
        }else{
            const {image}=req.files;
            //image should be less than 1mb
            if(image.size>1000000){
                return next(new HttpError("Profile picture too big. Should be less than 500kb",422))
            }
            // rename image
            let fileName=image.name;
            fileName=fileName.split(".")
            fileName=fileName[0] + uuid() + "." + fileName[fileName.length -1]
            await image.mv(path.join(__dirname,'..','uploads',fileName),async (err)=>{
                if(err){
                    return next(new HttpError(err))
                }
                // store image on cloudinary
                const result=await cloudinary.uploader.upload(path.join(__dirname,'..','uploads',fileName),{resource_type:"image"})
                if(!result.secure_url){
                    return next(new HttpError("Couldn't upload image to cloudinary",400))

                }
                // save post to db
                const newPost=await PostModel.create({creator:req.user.id,body,image:result.secure_url})
                await UserModel.findByIdAndUpdate(newPost?.creator,{$push:{posts:newPost?._id}})
                res.json(newPost)
            })


        }
    }catch(error){
        return next(new HttpError(error))
    }
}


//GET POST
//POST:api/posts/;id
//PROTECTED

const getPost=async(req,res,next)=>{
    try{
        const{id}=req.params;
        const post=await PostModel.findById(id)
        res.json(post)
    }catch(error){
        return next(new HttpError(error))
    }
}


//GET POST
//GET:api/posts
//PROTECTED

const getPosts=async(req,res,next)=>{
    try{
        const posts=await PostModel.find().sort({createdAt:-1})
        res.json(posts)
    }catch(error){
        return next(new HttpError(error))
    }
}


//UPDATE POST
//PATCH:api/posts/:id
//PROTECTED

const updatePost=async(req,res,next)=>{
    try{
        const postId=req.params.id;
        const {body}=req.body;
        //get post from db
        const post=await PostModel.findById(postId);
        // check if creator of the post is the logged in user
        if(post?.creator != req.user.id){
            return next(new HttpError("You can't update this post since you are not a creator",403))
        }
        const updatePost=await PostModel.findByIdAndUpdate(postId,{body},{new:true})
        res.json(updatePost).status(200)
    }catch(error){
        return next(new HttpError(error))
    }
}


//DELETE POST
//POST:api/posts
//PROTECTED

const deletePost=async(req,res,next)=>{
    try{
        const postId=req.params.id;
        //get post from db
        const post=await PostModel.findById(postId);
        // check if creator of the post is the logged in user
        if(post?.creator != req.user.id){
            return next(new HttpError("You can't update this post since you are not a creator",403))
        }
        const deletePost=await PostModel.findByIdAndDelete(postId);
        await UserModel.findByIdAndUpdate(post?.creator,{$pull:{posts:post?._id}})
        res.json(deletePost)
    }catch(error){
        return next(new HttpError(error))
    }
}


//GET FOLLOWING POST
//GET:api/posts/following
//PROTECTED

const getFollowingPosts=async(req,res,next)=>{
    try{
        const user=await UserModel.findById(req.user.id);
        const posts=await postModel.find({creator:{$in:user?.following}})
        res.json(posts)
        
    }catch(error){
        return next(new HttpError(error))
    }
}


//LIKE/DISLIKE POSTS
//GET:api/posts/:id/like
//PROTECTED

const likeDislikePosts=async(req,res,next)=>{
    try{
        const {id}=req.params;

        if (!req.user?.id) {
            return next(new HttpError("User not authenticated", 401));
        }
        const post=await PostModel.findById(id);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }
        //check if the logged in user has already liked post
        let updatedPost;
        if(post?.likes.includes(req.user.id)){
            updatedPost=await PostModel.findByIdAndUpdate(id,{$pull:{likes:req.user.id}},{new:true})

        }else{
            updatedPost=await PostModel.findByIdAndUpdate(id,{$push:{likes:req.user.id}},{new:true})

        }
        res.json(updatedPost)
    }catch(error){
        return next(new HttpError(error))
    }
}

//GET USER POSTS
//GET:api/posts/:id/like
//PROTECTED

const getUserPosts=async(req,res,next)=>{
    try{
        const userId=req.params.id;
        const posts=await UserModel.findById(userId).populate({path:"posts",options:{sort:{createsAt:-1}}})
        res.json(posts)
    }catch(error){
        return next(new HttpError(error))
    }
}

//CREATE BOOKMARK
//GET:api/posts/:id/bookmark
//PROTECTED

const createBookmark=async(req,res,next)=>{
    try{
        const {id}=req.params;
        // get user and check if post already in his bookmarks.If so then remove post,otherwise add post to bookmarks
        const user=await UserModel.findById(req.user.id);
        const postIsBookmarked=user?.bookmarks?.includes(id)
        if(postIsBookmarked){
            const userBookmarks=await UserModel.findByIdAndUpdate(req.user.id,{$pull:{bookmarks:id}},{new:true})
            res.json(userBookmarks)
        }else{
            const userBookmarks=await UserModel.findByIdAndUpdate(req.user.id,{$push: {bookmarks:id}},{new:true})
            res.json(userBookmarks)

        }
    }catch(error){
        return next(new HttpError(error))
    }
}

//GET BOOKMARKS
//GET:api/bookmarks
//PROTECTED

const getUserBookmarks=async(req,res,next)=>{
    try{
        const userBookmarks=await UserModel.findById(req.user.id).populate({path:"bookmarks",options:{sort:{createdAt:-1}}})
        res.json(userBookmarks);
    }catch(error){
        return next(new HttpError(error))
    }
}


module.exports={createPost,updatePost,deletePost,getPost,getPosts,getUserPosts,getUserBookmarks,createBookmark,likeDislikePosts,getFollowingPosts}