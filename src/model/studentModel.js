const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types
const subjects = ["Maths", "English", "Javascript"];
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true,
        enum: subjects
    },

    marks: {
        type : Number,
        required: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

    userId: {
        type : ObjectId,
        ref: 'User'
    }

},{ timestamps: true })

module.exports = mongoose.model('Student', studentSchema);