import mongoose, {  Document, Model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
    pic?: string; 
}

interface IUserDocument extends IUser, Document {}

const UserSchema = new mongoose.Schema<IUserDocument>(
    {   
        username: {
            type: String,
            required: true,
            trim: true,
           
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique:true
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        pic: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAjQarz9WGkjz4-GphE1fJdwwx06OPrRZAgtKlafWc_w",
        },
    },
   
    {
       
        timestamps: true,
    }
);

const User_: Model<IUserDocument> = mongoose.model<IUserDocument>('User_', UserSchema);

export = User_;
