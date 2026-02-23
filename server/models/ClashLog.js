const mongoose = require('mongoose');

const clashLogSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    day: String,
    time: String,
    roomNumber: String,
    clashType: { type: String, enum: ['Faculty', 'Room', 'Both'] },
    message: String,
}, { timestamps: true });

module.exports = mongoose.model('ClashLog', clashLogSchema);
