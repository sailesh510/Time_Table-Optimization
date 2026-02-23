const Timetable = require('../models/Timetable');
const ClashLog = require('../models/ClashLog');

const getTimetables = async (req, res) => {
    const timetables = await Timetable.find({}).populate('facultyId').populate('subjectId');
    res.json(timetables);
};

const createTimetable = async (req, res) => {
    const { facultyId, subjectId, day, time, roomNumber } = req.body;

    // Faculty Clash Detection
    const facultyClash = await Timetable.findOne({ facultyId, day, time });
    if (facultyClash) {
        await ClashLog.create({
            facultyId, subjectId, day, time, roomNumber,
            clashType: 'Faculty',
            message: 'Faculty is already busy in another session.'
        });
        return res.status(400).json({ message: 'Faculty Clash Detected: This teacher is already scheduled for this time slot.' });
    }

    // Room Clash Detection
    const roomClash = await Timetable.findOne({ roomNumber, day, time });
    if (roomClash) {
        await ClashLog.create({
            facultyId, subjectId, day, time, roomNumber,
            clashType: 'Room',
            message: 'Classroom is already occupied by another faculty.'
        });
        return res.status(400).json({ message: 'Room Clash Detected: This room is already occupied during this time slot.' });
    }

    const timetable = new Timetable({ facultyId, subjectId, day, time, roomNumber });
    const createdTimetable = await timetable.save();
    res.status(201).json(createdTimetable);
};

const deleteTimetable = async (req, res) => {
    const timetable = await Timetable.findById(req.params.id);
    if (timetable) {
        await Timetable.deleteOne({ _id: req.params.id });
        res.json({ message: 'Timetable entry removed' });
    } else {
        res.status(404).json({ message: 'Timetable entry not found' });
    }
};

const getStats = async (req, res) => {
    try {
        const totalFaculty = await require('../models/Faculty').countDocuments();
        const totalSubjects = await require('../models/Subject').countDocuments();
        const totalEntries = await Timetable.countDocuments();
        const clashCount = await ClashLog.countDocuments();

        res.json({ totalFaculty, totalSubjects, totalEntries, clashCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getClashLogs = async (req, res) => {
    const logs = await ClashLog.find({}).populate('facultyId').populate('subjectId').sort({ createdAt: -1 });
    res.json(logs);
};

module.exports = { getTimetables, createTimetable, deleteTimetable, getStats, getClashLogs };
