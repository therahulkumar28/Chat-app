import mongoose, { ObjectId }  from "mongoose";
import { IUser } from '../models/Usermodel';
import {IChat} from '../models/Chatmodel'
export interface Imessage {
    _id : ObjectId,
    sender : IUser ,
    content : string ,
    chat : IChat ,
}
const messageSchema = new mongoose.Schema({
    sender :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_"
    },
    content :{
        type : String ,
        trim : true 
    },
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    }
},{
    timestamps : true 
})

export const Message = mongoose.model<Imessage>('message',messageSchema);
