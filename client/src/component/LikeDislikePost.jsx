import React, { useEffect, useState } from 'react'
import {  FaRegHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {FcLike} from 'react-icons/fc'
import axios from 'axios'

const LikeDislikePost = (props) => {
    const [post,setPost]=useState(props.post)
    const userId=useSelector(state=> state?.user?.currentUser?.id)
    const token=useSelector(state=> state?.user?.currentUser?.token)
    const [postLiked,setPostLiked]=useState(post?.likes?.includes(userId))


    const handleLikeDislikePost=async()=>{
        try{
            const response=await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
            setPost(response?.data)

        }catch(error){
            console.log(error)
        }
    }


    //function to chk if post is liked/disliked
    const handleCheckIfUserLikedPost = () => {
        if(post?.likes?.includes(userId)){
            setPostLiked(true)
        }else{
            setPostLiked(false)
        }
    }

    useEffect(() => {
        handleCheckIfUserLikedPost();
    },[post])


  return (
    <button className='feed__footer-comments' onClick={handleLikeDislikePost}>
        {postLiked ? <FcLike/> : <FaRegHeart />}
        <small>{post?.likes?.length || 0}</small>

    </button>
  )
}

export default LikeDislikePost
