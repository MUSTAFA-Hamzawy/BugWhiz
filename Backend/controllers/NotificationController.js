const asyncHandler = require('express-async-handler');
const NotificationModel = require('../models/NotificationModel');
const status = require('../helpers/statusCodes');
const mongoose = require("mongoose");

const getNotifications = asyncHandler( async (req, res) => {
    try {
        const data = await NotificationModel.find({userID : req.user.id.toString(), isRead: false});
        res.status(status.OK).json(data);
    } catch (error) {
        throw new Error("Failed to load notifications.");
    }
})
const readNotifications = asyncHandler( async (req, res) => {
    const userID = req.user.id;
    try {
        await NotificationModel.updateMany({ userID }, { isRead: true });
        res.status(status.OK).json({ message: "Notifications marked as read." });
    } catch (error) {
        throw new Error("Failed to mark notifications as read.");
    }
})

module.exports = {
    getNotifications,
    readNotifications,
}