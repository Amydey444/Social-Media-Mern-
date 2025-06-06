const HttpError=require("../models/errorModel")
const conversationModel=require("../models/ConversationModel")
const MessageModel=require("../models/MessageModel");
const ConversationModel = require("../models/ConversationModel");



//CREATE MESSAGE
//POST:api/messages/:recieverId
//PROTECTED
const createMessage = async (req, res, next) => {
    try {
      const { receiverId } = req.params;
      const { messageBody } = req.body;
  
      if (!messageBody) {
        return next(new HttpError("Message body is required", 400));
      }
  
      let conversation = await ConversationModel.findOne({
        participants: { $all: [req.user.id, receiverId] },
      });
  
      if (!conversation) {
        conversation = await ConversationModel.create({
          participants: [req.user.id, receiverId],
          lastMessage: { text: messageBody, senderId: req.user.id },
        });
      }
  
      const newMessage = await MessageModel.create({
        conversationId: conversation._id,
        senderId: req.user.id,
        text: messageBody,
      });
  
      await conversation.updateOne({
        lastMessage: { text: messageBody, senderId: req.user.id },
      });
  
      // Optional: emit via socket if defined
      if (typeof getReceiverSocketId === 'function') {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error.message);
      return next(new HttpError("Server error while creating message", 500));
    }
  };
  

//GET MESSAGE
//GET:api/messages/:recieverId
//PROTECTED
const getMessage=async(req,res,next)=>{
    try{
        const {recieverId}=req.params;
        const conversation=await conversationModel.findOne({participants:{$all:[req.
        user.id,recieverId]}})
        if(!conversation){
            return next(new HttpError("you have no conversation with this person",404))
        }
        const messages=await MessageModel.find({conversationId:conversation._id}).sort({createdAt:1})
        res.json(messages)
    }catch(error){
        return next(new HttpError(error))
    }
}

//GET CONVERSATIONS
//POST:api/messages/:recieverId
//PROTECTED
const getConversations=async(req,res,next)=>{
    try{
        let conversations=await ConversationModel.find({participants:req.user.id}).populate({path:
        "participants",select:"fullName profilePhoto"}).sort({createdAt:-1});
        //remove logged in user from the participants array
        conversations.forEach((conversation)=>{
            conversation.participants=conversation.participants.filter(
                (participant)=>participant._id.toString()!==req.user.id.toString()
            );
        });
        res.json(conversations)
    }catch(error){
        return next(new HttpError(error))
    }
}

module.exports={createMessage,getMessage,getConversations}