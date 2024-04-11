const asyncHandler = require('express-async-handler');
import {  Chat, IChat } from '../models/Chatmodel';
import { Request, Response } from 'express';
import { IUser, User_ } from '../models/Usermodel';


// Define a custom request interface extending Express Request interface
interface CustomRequest extends Request {
    user: IUser;
}

// Controller function to access chat
export const accessChat = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { userId } = req.body; // Extract userId from request body

    // Check if userId is provided in the request body
    if (!userId) {
        console.log('UserId param not sent with request');
        return res.status(400).send('UserId param not sent with request');
    }

    try {
        // Find chat based on specific conditions
        let isChat:IUser[] = await Chat.find({
            isGroupChat: false,
            $and: [
                
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ],
        }).populate('users', '-password').populate('latestMessage');


        // Populate latestMessage.sender field in isChat array
        isChat = await User_.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name pic email'
        });


        // If chat exists, send it; otherwise, prepare chatData for creating a new chat
        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            // Format userIds as ObjectId array


            // Create chatData object for new chat
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };
            try {
                // Create the chat document
                const createdChat:IChat = await Chat.create(chatData);

                // Fetch full chat details
                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');

                // Send full chat details as response
                res.status(200).send(fullChat);
            }
            catch (error) {
                console.log('Error during creating chat: ', String(error));
                res.status(500).send('Internal Server Error');
            }
        }
    } catch (error) {
        console.log('Error during creating chat: ', String(error));
        res.status(500).send('Internal Server Error');
    }
});

//controller function to fetch chat 
export const fetchChats = asyncHandler(async (req:CustomRequest , res: Response )=>{
    try{
        Chat.find( {  users: {$elemMatch: {$eq : req.user._id} } } )
        .populate("users", "-password")
        .populate('groupAdmin','-password')
        .populate('latestMessage')
        .sort({updatedAt :-1})
        .then(async (results)=>{
            results = await User_.populate(results , {
                path :"latestMessage.sender",
                select : "name pic email",
            })
            res.status(200).send(results)
        })
    }catch(error){
        console.log('Error during fetching chats',String(error))
    }
})

export const createGroupChat  = asyncHandler(async (req : CustomRequest , res : Response)=>{
    if(!req.body.users || !req.body.name ){
        return res.status(400).send({message : "Please fill all the fields "})
    }
    var users = JSON.parse(req.body.users);

    if(users.length < 2 ){
        return res.status(400).send("More than two field are to be filled")
    }
    users.push(req.user);
    try{
        const groupChat = await Chat.create({
            chatName : req.body.name , 
            users : users ,
            isGroupChat :true ,
            groupAdmin : req.user ,
        });
        const fullGroupChat = await Chat.findOne({_id : groupChat._id})
        .populate("users" , "-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400).send({message : "Unable to get groupChat data"});
        console.log('Error during groupchat ',String(error));
    }
})

export  const renameGroup = asyncHandler(async (req : CustomRequest , res : Response )=>{
    const {chatId  , chatName } = req.body ;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId ,{
            chatName :chatName
        },{
            new:true 
        }
    ).populate('users',"-password")
    .populate('groupAdmin','-password');
    if(!updatedChat){
        throw new Error("chat not found");
        return res.status(404);
    }
    res.json(updatedChat)
})

export const removeFromGroup = asyncHandler(async (req :CustomRequest , res : Response )=>{
    const {chatId , userId } = req.body ;
   try{ const removed = await Chat.findByIdAndUpdate(
        chatId ,{
            $pull:{users:userId},
        },{
            new:true 
        }
    ).populate("users","-password")
    .populate("groupAdmin", "-password");

    if(!removed ){
        res.status(404)
        throw new Error('Chat  not found ')
    }
    else{
        res.json(removed)
    }}catch(error){
        console.log(String(error))
    }

})

export const addToGroup = asyncHandler(async (req : CustomRequest , res : Response)=>{
    const {chatId , userId } = req.body ;
    const added = await Chat.findByIdAndUpdate(
        chatId ,{
            $push:{users:userId},
        },{
            new:true 
        }
    ).populate("users","-password")
    .populate("groupAdmin", "-password");
    if(!added ){
        res.status(404)
        throw new Error('Chat  not found ')
    }
    else{
        res.json(added)
    }
})