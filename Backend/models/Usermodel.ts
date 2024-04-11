import mongoose, {  Model, ObjectId } from "mongoose";

export interface IUser {
    _id? : ObjectId, 
    username: string;
    email: string;
    password: string;
    pic?: string; 
}

const UserSchema = new mongoose.Schema<IUser>(
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

export const User_: Model<IUser> = mongoose.model<IUser>('user_', UserSchema);

