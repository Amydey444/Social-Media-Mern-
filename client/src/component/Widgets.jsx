import React from 'react'
import FriendRequest from './FriendRequest'
import FriendRequests from './FriendRequests'
import MessagesList from './MessagesList'

const Widgets = () => {
  return (
    <section className='widgets'>
      <FriendRequests />
      <MessagesList />
      
    </section>
  )
}

export default Widgets
