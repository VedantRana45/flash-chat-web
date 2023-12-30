const User = require('../Model/UserSchema');
const generateToken = require('../config/generateToken');
const asyncHandler = require('express-async-handler');

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await user.comparePassword(password)) {
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(404);
        throw new Error("User Does not exist with this email")
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, pic } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(404);
        throw new Error("Please fill all Details");
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
        res.status(400);
        throw new Error("User Exist already")
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("User Creation Operation Failed");
    }
});

const searchUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, pic } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, {
        firstName,
        lastName,
        email,
        pic
    }, { new: true })

    res.status(200).send(user);
})

module.exports = { loginUser, registerUser, searchUser, updateUserProfile };