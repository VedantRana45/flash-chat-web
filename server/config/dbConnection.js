const mongoose = require('mongoose');

const connectionToMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        })
        console.log(`DB Connected Successfully : ${conn.connection.host}`);
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

module.exports = connectionToMongo;