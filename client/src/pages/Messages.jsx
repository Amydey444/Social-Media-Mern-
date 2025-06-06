import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import MessagesList from '../component/MessagesList';
import MessageItem from '../component/MessageItem';
import ProfileImage from '../component/ProfileImage';
import { IoMdSend } from 'react-icons/io';
import { userActions } from '../store/user-slice';

const Messages = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherMessager, setOtherMessager] = useState({});
  const [messageBody, setMessageBody] = useState('');
  const [conversationId, setConversationId] = useState('');
  const messageEndRef = useRef();

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const socket = useSelector(state => state?.user?.socket);
  const conversations = useSelector(state => state?.user?.conversations);
  const dispatch = useDispatch();

  const getOtherMessager = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${receiverId}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    setOtherMessager(response?.data);
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response?.data);
      setConversationId(response?.data[0]?.conversationId);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        { messageBody },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(prevMessages => [...prevMessages, response?.data]);
      setMessageBody('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
    getOtherMessager();
  }, [receiverId]);

  useEffect(() => {
    if (!socket) return;
  
    const handleNewMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
  
      dispatch(userActions?.setConversations(conversations.map(conversation => {
        if (conversation?._id === conversationId) {
          return {
            ...conversation,
            lastMessage: { ...conversation.lastMessage, seen: true }
          };
        }
        return conversation;
      })));
    };
  
    socket.on("newMessage", handleNewMessage);
  
    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, messages]);
  

  return (
    <section className="messagesBox">
      <header className="messagesBox__header">
        <ProfileImage image={otherMessager?.profilePhoto} />
        <div className="messagesBox__header--info">
          <h4>{otherMessager?.fullName}</h4>
          <small>last seen 2 mins ago</small>
        </div>
      </header>

      <ul className="messagesBox__messages">
        {messages?.map((message, idx) => (
          <MessageItem key={idx} message={message} />
        ))}
        <div ref={messageEndRef}></div>
      </ul>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={messageBody}
          onChange={({ target }) => setMessageBody(target.value)}
          placeholder="Enter message..."
          autoFocus
        />
        <button type="submit"><IoMdSend /></button>
      </form>
    </section>
  );
};

export default Messages;
