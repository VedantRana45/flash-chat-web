const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;


const userSchema = new schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
    }
});

userSchema.methods.comparePassword = async function (crendentialPassword) {
    const result = await bcrypt.compare(crendentialPassword, this.password);
    return result;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified()) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model("User", userSchema);

module.exports = User;