const jwt = require("jsonwebtoken");
const User = require('../Model/UserSchema.js');
const asyncHandler = require('express-async-handler');

const authorizeUser = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const authUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await User.findById(authUser.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Token is not Valid");
        }
    } else {
        res.status(401);
        throw new Error("Please Login !")
    }

})

module.exports = { authorizeUser };