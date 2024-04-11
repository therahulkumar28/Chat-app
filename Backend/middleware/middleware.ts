const jwt = require('jsonwebtoken');
const { User_ } = require('../models/Usermodel');
const asyncHandler = require('express-async-handler');
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/Usermodel';

interface JwtPayload {
    userId: string;
    iat: number;
}

interface CustomRequest extends Request {
    user?: IUser; 
}
const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized User'));
    }
    try {
        const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        console.log(decoded.userId)
        
        const user = await User_.findById(decoded.userId).select("-password");

        if (!user) {
            res.status(401);
            return next(new Error('User not found'));
        }

        req.user = user;
        console.log(req.user)
        next();
    } catch (error) {
        res.status(401);
        return next(new Error(String(error)));
    }
});

export default protect;


