const Chat = require('../Model/ChatSchema.js');
const asyncHandler = require('express-async-handler');
const User = require('../Model/UserSchema');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        // console.log("user id is not sent with req");
        return res.status(400);
    }

    var chat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate("latestMessage");

    chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (chat.length > 0) {
        res.send(chat[0]);
    } else {
        try {
            const createdChat = await Chat.create({
                chatName: "sender",
                isGroup: false,
                users: [req.user._id, userId]
            })

            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            )

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {

        let userAllChats = await Chat.find(
            {
                users: { $elemMatch: { $eq: req.user._id } }
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        userAllChats = await User.populate(userAllChats, {
            path: "latestMessage.sender",
            select: "firstName lastName pic email"
        })

        res.status(200).send(userAllChats);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.users) {
        return res.status(400).send({ message: "Please fill up all fields." })
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send({ message: "Minimum 3 users required to create group." });
    }

    users.push(req.user);

    try {

        var createdGroup = await Chat.create({
            chatName: req.body.name,
            isGroup: true,
            users: users,
            groupAdmin: req.user._id,
        })

        createdGroup = await Chat.findOne(createdGroup._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(createdGroup);

    } catch (error) {
        return res.status(400).send({ message: "Failed to create Group." });
    }
})

const renameGroup = asyncHandler(async (req, res) => {

    const { chatName, chatId } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            chatName
        }, {
            new: true
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (updatedChat) {
            res.status(200).send(updatedChat);
        } else {
            res.status(400).send({ message: "Chat not found" });
        }

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

const addUserToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {

        const updatedGroup = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (updatedGroup) {
            res.status(200).send(updatedGroup);
        } else {
            res.status(400).send({ message: "Chat or User not found" });
        }

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

const removeGroupUser = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {

        const updatedGroup = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId }
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (updatedGroup) {
            res.status(200).send(updatedGroup);
        } else {
            res.status(400).send({ message: "Chat or User not found" });
        }

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeGroupUser, addUserToGroup };