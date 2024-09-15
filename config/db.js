const mongoose = require('mongoose');

async function connectToDB() {
    const MONGODB_URI = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to db')
    } catch (error) {
        console.log('Connect to db failed' + error.message);
    }
}

module.exports = connectToDB;