const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    day: { type: String, required: true }, // e.g., Monday
    time: { type: String, required: true }, // e.g., 09:00 - 10:00
    roomNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
