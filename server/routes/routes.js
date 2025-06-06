const express=require("express");
const router=express.Router();



const{registerUser,loginUser,getUser,getUsers,editUser,followUnfollowUser,changeUserAvatar}=require('../controllers/userControllers')
const {createPost,updatePost,deletePost,getPost,getPosts,getUserPosts,getUserBookmarks,createBookmark,likeDislikePosts,getFollowingPosts}=require('../controllers/postController')
const {createComment,getPostComments,deleteComments}=require('../controllers/commentControllers')
const {createMessage,getMessage,getConversations}=require('../controllers/messageControllers')
const authMiddleware=require("../middleware/authMiddleware")

//USER ROUTES
router.post('/users/register',registerUser)
router.post('/users/login',loginUser)
router.get('/users/bookmarks',authMiddleware,getUserBookmarks)
// brought this route up here to avoid conflict with get user
router.get('/users/:id',authMiddleware,getUser)
router.get('/users',authMiddleware,getUsers)
router.patch('/users/:id',authMiddleware,editUser)
router.get('/users/:id/follow-unfollow',authMiddleware,followUnfollowUser)
router.post('/users/avatar',authMiddleware,changeUserAvatar)
router.get('/users/:id/posts',authMiddleware,getUserPosts)

//POST ROUTES
router.post('/posts',authMiddleware,createPost)
router.get('/posts/following',authMiddleware,getFollowingPosts)
router.get('/posts/:id',authMiddleware,getPost)
router.get('/posts',authMiddleware,getPosts)
router.patch('/posts/:id',authMiddleware,updatePost)
router.delete('/posts/:id',authMiddleware,deletePost)
router.get('/posts/:id/like',authMiddleware,likeDislikePosts)
router.get('/posts/:id/bookmark',authMiddleware, createBookmark)


//POST ROUTES
router.post('/comments/:postId',authMiddleware,createComment)
router.get('/comments/:postId',authMiddleware,getPostComments)
router.delete('/comments/:commentId',authMiddleware,deleteComments)

//MESSAGE ROUTES
router.post('/messages/:receiverId',authMiddleware,createMessage)
router.get('/messages/:receiverId',authMiddleware,getMessage)
router.get('/conversations',authMiddleware,getConversations)




  


module.exports=router;