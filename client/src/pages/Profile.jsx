import React, { useEffect, useState } from 'react'
import UserProfile from '../component/UserProfile'
import HeaderInfo from '../component/HeaderInfo'
import Feed from '../component/Feed'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import EditPostModal from '../component/EditPostModal'
import EditProfileModal from '../component/EditProfileModal'

const Profile = () => {
  const [user, setUser] = useState({})
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { id: userId } = useParams()
  const token = useSelector(state => state?.user?.currentUser?.token)
  const editPostModalOpen=useSelector(state => state?.ui?.editPostModalOpen)
  const editProfileModalOpen=useSelector(state => state?.ui?.editProfileModalOpen)


  // Get user posts
  const getUserPosts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setUser(response?.data)
      setUserPosts(response?.data?.posts)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getUserPosts()
  }, [userId])

  const deletePost = async (postId) => {
    try {
      const response=await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`,
      {withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      setUserPosts(userPosts?.filter(p => p?._id != postId))
    } catch (error) {
      console.log(error)
      
    }
  }

  const updatePost = async (data,postId) => {
    try {
      const response=await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${postId}`,
      data,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      if(response?.status==200){
        const updatedPost=response?.data;
        setUserPosts(userPosts?.map(post => {
          if(updatedPost?._id.toString()==post?._id.toString()) {
            post.body=updatedPost.body;
          }
          return post;
        }))
      }
      
    } catch (error) {
      console.log(error)
      
    }
  }

  

  return (
    <section>
      <UserProfile setUser={setUser} />
      <HeaderInfo text={`${user?.fullName || "User"}'s posts`} />
      <section className="profile__posts">
        {userPosts.length < 1 ? (
          <p className='center'>No posts by this user</p>
        ) : (
          userPosts.map(post => (
            <Feed key={post?._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>
      {editPostModalOpen  && <EditPostModal onUpdatePost={updatePost}/>}
      {editProfileModalOpen  && <EditProfileModal />}
    </section>
  )
}

export default Profile
