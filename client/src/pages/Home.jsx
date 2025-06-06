import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../component/CreatePost'
import axios from 'axios'
import Feeds from '../component/Feeds'
import FriendRequest from '../component/FriendRequest'
import FriendRequests from '../component/FriendRequests'

const Home = () => {
  const [posts,setPosts]=useState([])
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const token=useSelector(state=>state?.user?.currentUser?.token)

  //function to create post
  const createPost=async(data)=>{
    setError("")
    console.log("🚀 Token being sent:", token);

  

  
    try{
      const response=await axios.post(`${import.meta.env.VITE_API_URL}/posts`,data,{
      withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      const newPost=response?.data;
      setPosts([newPost,...posts])

    }catch (err){
      console.error("❌ Post creation failed:", err?.response?.data || err);
      setError(err?.response?.data?.message)

    }
  }


  //function to get posts
  const getPosts=async()=>{
    setIsLoading(true)
    try{

      const response=await axios.get(`${import.meta.env.VITE_API_URL}/posts`,{withCredentials:true,
      headers:{Authorization:`Bearer ${token}`}})
      setPosts(response?.data)
    }catch(err){
      console.log(err)

    }
  }

  useEffect(()=>{
    getPosts()

  },[setPosts])

  console.log(posts)




  return (
    <section className="mainArea">
      <CreatePost onCreatePost={createPost} error={error}/>
      <Feeds posts={posts} onSetPosts=
      {setPosts} />

    </section>
  )
}

export default Home
