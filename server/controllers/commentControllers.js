const HttpError=require("../models/errorModel")
const CommentModel=require('../models/commentsModel')
const PostModel=require('../models/postModel')
const UserModel=require('../models/userModel')




//CREATE COMMENT
//POST:api/comments/:postId


//PROTECTED

const createComment=async(req,res,next)=>{
    try{
        const {postId} =req.params;
        const {comment}=req.body;
        if(!comment){
            return next(new HttpError("Please write a comment",422))
        }
        // get comment creator from db
        const commentCreator=await UserModel.findById(req.user.id)
        const newComment=await CommentModel.create({creator:{creatorId:req.user.id,
        creatorName:commentCreator?.fullName,creatorPhoto:commentCreator?.
        profilePhoto}, comment,postId })
        await PostModel.findByIdAndUpdate(
        postId,
        {$push:{comments: newComment?._id}},
        {new:true})
        
        
        res.json(newComment)

    }catch(error){
        return next(new HttpError(error.message || "Failed to create comment", 500));
    }
}





//GET POST COMMENTS
//GET:api/comments/:postId



//PROTECTED

const getPostComments = async (req, res, next) => {
    try {
      const { postId } = req.params;
      console.log("➡️ Received postId:", JSON.stringify(postId));


      const rawPost = await PostModel.findById(postId);
    if (!rawPost) {
      console.log("❌ Post not found in DB");
      return next(new HttpError("Post not found", 404));
    }
    console.log("✅ Post found. Comment IDs:", rawPost.comments);

  
    // Now populate the comments
    const populatedPost = await PostModel.findById(postId).populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }
      });
  
      console.log("📦 Populated Comments:", populatedPost.comments);
      res.json(populatedPost.comments);
  
    } catch (error) {
      console.error("❌ GetPostComments error:", error);
      return next(new HttpError(error.message || "Failed to fetch comments", 500));
    }
};
  
//Delete COMMENTS
//DELETE:api/comments/:postId



//PROTECTED

const deleteComments=async(req,res,next)=>{
    try{
        const {commentId}=req.params;
        //get the comment from db
        const comment=await CommentModel.findById(commentId);
        const commentCreator=await UserModel.findById(comment?.creator?.creatorId)
        //check if the creator is the one performing the deletion
        if(commentCreator?._id != req.user.id){
            return next(new HttpError("Unauthorised action",403))
        }
        // remove comment id from post comments array
        await PostModel.findByIdAndUpdate(comment?.postId,{$pull:{comments:commentId}})
        const deleteComment=await CommentModel.findByIdAndDelete(commentId)
        res.json(deleteComment)
    }catch(error){
        return next(new HttpError(error.message || "Failed to create comment", 500));
    }
}





module.exports={createComment,getPostComments,deleteComments}