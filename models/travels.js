const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    title: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Travel', travelSchema);
