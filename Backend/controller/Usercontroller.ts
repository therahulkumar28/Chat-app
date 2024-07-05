const jwt = require('jsonwebtoken');
const express = require('express');
const Router = express.Router();
const zod = require('zod');
import { IUser , User_} from '../models/Usermodel';
import { Request, Response, query } from "express";
import protect from '../middleware/middleware';
const multer = require('multer')

interface CustomRequest extends Request {
    user?: IUser; 
}
// Configure multer to handle form data
const storage = multer.memoryStorage(); // You can configure storage as needed
const upload = multer({ storage: storage });

const signupBody = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string(),
    pic: zod.string().optional()
});

Router.post('/signup', upload.none(), async function (req: Request, res: Response) {
    const body = await req.body;

    const { success } = signupBody.safeParse(body);
   

    if (!success) {
        return res.status(401).json({
            msg: "Invalid inputs"
        });
    }



    const existUser = await User_.findOne({
        email: body.email
    });

    if (existUser) {
        return res.status(401).json({
            msg: "User already exists"
        });
    }

    const newUser = await User_.create({
        name: body.username,
        username: body.username,
        email: body.email,
        password: body.password,
        //  pic: body.pic,
        // pic: picUrl, // Uncomment this line if you're handling file uploads
    });

    const userId = newUser._id;
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
});

Router.post('/signin', upload.none(), async function (req: Request, res: Response) {
  
    const { success } = signinBody.safeParse(await req.body);
    if (!success) {
        return res.status(401).json({
            msg: "Invalid Inputs"
        });
    }

    const existUser = await User_.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (!existUser) {
        return res.status(401).json({
            msg: "User does not exist"
        });
    }

   
    const token = jwt.sign({
        userId: existUser._id,
    }, process.env.JWT_SECRET);

    // Send the response once, with the token
    res.json({
        token: token,
    });
});

Router.get('/params?', protect, async function (req: CustomRequest, res: Response) {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    try {
        const users = await User_.find(keyword)
            .find({ _id: { $ne: req.user?._id } })
            .select('-password'); // Exclude the password field
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: "Error fetching users" });
    }
});


export = Router;
