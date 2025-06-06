import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MessageListItem from './MessageListItem'
import { useState } from 'react'
import axios from 'axios'

const MessageList = () => {
  const [conversations,setConversations] =useState([])
  const token=useSelector(state=>state?.user?.currentUser?.token)
  const socket=useSelector(state=>state?.user?.socket)

  //get chats from db
  const getConversations=async() => {
    try {
      const response=await axios.get(`${import.meta.env.VITE_API_URL}/conversation`,
      {withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      setConversation(response?.data);
      
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    getConversations()

  },[socket])
  
  return (
    <menu className="messageList">
      <h3>Recent Messages</h3>
      {
        conversations?.map(conversation => <MessageListItem key={conversation?._id}
        conversation={conversation}/>)
      }
    </menu>
    
  )
}

export default MessageList
