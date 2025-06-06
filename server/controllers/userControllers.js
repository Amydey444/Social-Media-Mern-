const HttpError=require('../models/errorModel')
const UserModel=require('../models/userModel')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const uuid=require("uuid").v4;
const path=require("path")
const cloudinary=require("../utils/cloudinary")

// REGISTER USER
//POST:api/users/register
//UNPROTECTED

const registerUser=async(req, res, next)=>{
    try{
        const {fullName,email,password,confirmPassword}=req.body;
        if(!fullName || !email || !password || !confirmPassword){
            return next(new HttpError("Fill in all fields",422))
        }
        // make the email lowercased
        const lowerCasedEmail=email.toLowerCase();

        //check DB if email already exist
        const emailExists=await UserModel.findOne({email:lowerCasedEmail})
        if(emailExists){
            return next(new HttpError("Email already exists",422))
        }
        //check if password and confirm password matches
        if(password !==confirmPassword){
            return next(new HttpError("Passwords do not match",422))
        }
        // check password length
        if(password.length<6){
            return(next(new HttpError("Password should be at least 6 characters",422)))
        }
        // hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //add user to DB
        const newUser=await UserModel.create({fullName,email:lowerCasedEmail,password:hashedPassword})
        res.json(newUser).status(201);



    }catch(error){
        return next(new HttpError(error.message || "Register failed",500))

    }
}


// LOGIN USER
//POST:api/users/login
//UNPROTECTED

const loginUser=async(req, res, next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all fields",422))
        }
        //make email lowercased
        const lowerCasedEmail=email.toLowerCase();
        //fetch user from the DB
        const user=await UserModel.findOne({email:lowerCasedEmail})
        if(!user){
            return next(new HttpError("Invalid Credential",422))
        }
        //const {uPassword,...userInfo}=user;
        //compare passwords
        const comparedPass=await bcrypt.compare(password,user?.password);
        if(!comparedPass){
            return next(new HttpError("Invalid Credential",422))
        }
        const token=await jwt.sign({id:user?._id},process.env.JWT_SECRET,
        {expiresIn:"1h"})
        res.status(200).json({token,id: user?._id});
        res.status(200).json({token,id: user?._id,...userInfo});



    }catch(error){
        return next(new HttpError(error))

    }
}


// GET USER
//GET:api/users/:id
//PROTECTED

const getUser=async(req, res, next)=>{
    try{
        const{id}=req.params;
        const user=await UserModel.findById(id).select("-password")
        if(!user){
            return next(new HttpError("User not found ",404))
        }
        res.json(user).status(200)

    }catch(error){
        return next(new HttpError(error))

    }
}



// GET USERS
//GET:api/users
//PROTECTED

const getUsers=async(req, res, next)=>{
    try{
        const users=await UserModel.find().limit(10).sort({createdAt:-1})
        res.json(users);

    }catch(error){
        return next(new HttpError(error))

    }
}




//EDIT USERS
//PATCH:api/users/edit
//PROTECTED

const editUser=async(req, res, next)=>{
    try{
        const {fullName,bio}=req.body;
        const editedUser=await UserModel.findByIdAndUpdate(req.user.id,{fullName,bio},{new:true})
        res.json(editedUser).status(200)

    }catch(error){
        return next(new HttpError(error))

    }
}


//FOLLOW/UNFOLLOW USER
//GET:api/users/follow-unfollow
//PROTECTED

const followUnfollowUser=async(req, res, next)=>{
    try{
        const userToFollowId=req.params.id;
        if(req.user.id == userToFollowId){
            return next(new HttpError("You can't follow/unfollow yourself",422))

        }
        const currentUser=await UserModel.findById(req.user.id);
        const isFollowing=currentUser?.following?.includes(userToFollowId);
        // follow if not following ,else unfollow if already following
        if(!isFollowing){
            const updatedUser=await UserModel.findByIdAndUpdate(userToFollowId,
                {$push:{followers:req.user.id}},{new:true})
                await UserModel.findByIdAndUpdate(req.user.id,{$push:{following:
                userToFollowId}},{new:true})
                res.json(updatedUser)

        }else{
            const updatedUser=await UserModel.findByIdAndUpdate(userToFollowId,
                {$pull:{followers:req.user.id}},{new:true})
                await UserModel.findByIdAndUpdate(req.user.id,{$pull:{following:
                userToFollowId}},{new:true})
                res.json(updatedUser)

        }

    }catch(error){
        return next(new HttpError(error))

    }
}


//Change profile photo
//PATCH:api/users/avatar
//PROTECTED

const changeUserAvatar=async(req, res, next)=>{
    try{
        if(!req.files.avatar){
            return next(new HttpError("Please choose an image",422))
        }
        const {avatar}=req.files;
        
        // check file size
        if(avatar.size > 500000){
            return next(new HttpError("Profile picture too big.Should be less than 500kb."))
        }

         // Rename the file
        const fileExtension = path.extname(avatar.name);
        const newFilename = `${uuid()}${fileExtension}`;
        const filePath = path.join(__dirname, "..", "uploads", newFilename);
        
        avatar.mv(path.join(__dirname,"..","uploads",newFilename),async(err)=>{
            if(err) {
                return next(new HttpError(err))
            }
            // store image on cloudinary
            const result=await cloudinary.uploader.upload(path.join(__dirname,"..","uploads",newFilename),{resource_type:"image"});
            if(!result.secure_url){
                return next(new HttpError("Couldn't upload image to cloudinary",422))
            }
            const updatedUser=await UserModel.findByIdAndUpdate(req.user.id,{profilePhoto:result?.secure_url},{new:true})
            res.status(200).json({ avatar: result.secure_url });
        })





    }catch(error){
        return next(new HttpError(error.message || "Failed to change avatar", 500));

    }
}


module.exports={registerUser,loginUser,getUser,getUsers,editUser,followUnfollowUser,changeUserAvatar}