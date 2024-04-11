import mongoose, { ObjectId }  from "mongoose";
import { IUser } from '../models/Usermodel';
import {Imessage} from '../models/Messagemodel'
export interface IChat {
    _id:ObjectId,
    chatName? : string ,
    isGroupChat? : boolean ,
    users? :IUser,
    latestMessage? : Imessage ,
    groupAdmin? : IUser ,

}
const ChatSchema = new  mongoose.Schema ({
    chatName  :{
        type : String , trim : true ,
    },
    isGroupChat : {
        type : Boolean , default : false,
    },
    users :[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_",
    }],
    latestMessage : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }, groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_",
      },
},{
    timestamps:true 
});
 
export const Chat = mongoose.model<IChat>('Chat' , ChatSchema);
