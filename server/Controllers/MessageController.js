const expressAsyncHandler = require("express-async-handler");
const Message = require('../Model/MessageSchema');
const User = require("../Model/UserSchema");
const Chat = require("../Model/ChatSchema");

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        // console.log("message Data not found");
        return res.status(400).send({ message: "message Data not found" })
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "firstName lastName pic");

        message = await message.populate("chat");

        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName pic email",
        });


        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

const fetchMessages = expressAsyncHandler(async (req, res) => {
    try {

        const allMessages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "firstName lastName pic email")
            .populate("chat");

        res.status(200).json(allMessages);


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = { sendMessage, fetchMessages };