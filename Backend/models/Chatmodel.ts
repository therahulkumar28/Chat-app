import { timeStamp } from "console";
import mongoose  from "mongoose";

const ChatSchema = new  mongoose.Schema ({
    chatName  :{
        type : String , trim : true ,
    },
    isGroupChat : {
        type : Boolean , default : false,
    },
    users : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_",
    },
    latestMessage : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }, groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_",
      },
},{
    timestamps:true 
});
 
const Chat = mongoose.model('Chat' , ChatSchema);
export = Chat ;