import mongoose  from "mongoose";

const messageSchema = new mongoose.Schema({
    sender :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User_"
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

const Message = mongoose.model('message',messageSchema);
export = Message ;