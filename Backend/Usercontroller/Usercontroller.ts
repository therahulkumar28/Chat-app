const jwt = require('jsonwebtoken');
const express = require('express');
import { JWT_SECRET } from '../config/jsonwebtoken';
const Router = express.Router();
const zod = require('zod');
const User_ = require('../models/Usermodel');
import { Request, Response } from "express";
const multer = require('multer')

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
    console.log(success);

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
    }, JWT_SECRET);

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
    const { success } = signinBody.safeParse(req.body);
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

    console.log(existUser);
    const token = jwt.sign({
        userId: existUser._id,
    }, JWT_SECRET);

    // Send the response once, with the token
    res.json({
        token: token,
    });
});

export = Router;
