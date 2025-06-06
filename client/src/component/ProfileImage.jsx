import React from 'react'

const ProfileImage = ({image,className}) => {
  return (
    <div className={`ProfileImage ${className}`}>
      <img src={image} alt="" />
    </div>
  )
}

export default ProfileImage
