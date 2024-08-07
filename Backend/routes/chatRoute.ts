import protect from "../middleware/middleware";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controller/Chatcontroller";
const express = require('express')

const router = express.Router();

router.route('/').post(protect , accessChat);
router.route('/').get(protect,fetchChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect , renameGroup);
router.route('/removegroup').put(protect , removeFromGroup);
router.route('/addgroup').put(protect , addToGroup);

module.exports = router ;