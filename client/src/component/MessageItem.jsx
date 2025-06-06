import React from 'react';
import { useSelector } from 'react-redux';

const MessageItem = ({ message }) => {
    console.log('Message:', message);
  const currentUserId = useSelector((state) => state?.user?.currentUser?._id);

  const isOwnMessage = message?.sender === currentUserId;

  return (
    <li className={`messageItem ${isOwnMessage ? 'own' : ''}`}>
      <div className="messageItem__content">
        <p>{message?.messageBody}</p>
        <span className="messageItem__time">
          {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </li>
  );
};



export default MessageItem;

