const express = require('express');
const app = express();
const dotenv = require('dotenv')
import connectDB = require("./db");
import userRoute = require('./routes/userRoute')
import chatRoute = require('./routes/chatRoute')
import { Request , Response } from "express";
const cors = require ('cors');
app.use(cors());

dotenv.config();
connectDB();
app.use(express.json());

const port = 3000;

app.use('/api/user',userRoute);
app.use('/api/chat',chatRoute);

app.get('/', (req :Request, res : Response) => {
    res.send('Hi there');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
