# Social Media MERN App

A full-stack social media application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to register, log in, create posts, like/dislike, comment, chat with others, and manage their profile.

---

## 🚀 Features

- **Authentication** – Sign up / Log in with JWT
- **Create & Edit Posts**
- **Like / Dislike Posts**
- **Comment on Posts**
- **Real-time Messaging**
- **Friend Requests & Suggestions**
- **User Profiles**
- **Theme Support** (Light/Dark)
- **Image Uploads with Cloudinary**

---

## Tech Stack

### Frontend:
- React.js
- Redux Toolkit
- React Router
- Vite

### Backend:
- Node.js
- Express.js
- MongoDB
- Socket.io (for messaging)
- Cloudinary (image uploads)

---
## Folder Structure

social media app/
├── client/ # Frontend code (React)
│ ├── src/
│ └── public/
├── server/ # Backend code (Node/Express)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── uploads/


---

## How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Amydey444/Social-Media-Mern-.git
cd social-media-app
```
### 2.Navigate into the Project Folder
```bash
cd social-media-app
```
### 3.Install Client Dependencies
```bash
cd client
```
```bash
npm install
```
### 4. Install Server Dependencies
```bash
cd ../server
```
```bash
npm install
````
### 5. Add Environment Variables
Create a .env file in the server/ folder:
```bash
touch .env
```
### Add your secrets inside .env like:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### 6.Start the Backend Server
```bash
npm run dev
```
### 7.Start the Frontend App
```bash
cd client
npm run dev
```








