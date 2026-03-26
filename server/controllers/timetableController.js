const Timetable = require('../models/Timetable');
const ClashLog = require('../models/ClashLog');
const Faculty = require('../models/Faculty');

const ALL_TIME_SLOTS = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 01:00', '02:00 - 03:00', '03:00 - 04:00', '04:00 - 05:00'
];

const getTimetables = async (req, res) => {
    const timetables = await Timetable.find({}).populate('facultyId').populate('subjectId');
    res.json(timetables);
};

const createTimetable = async (req, res) => {
    const { facultyId, subjectId, day, time, roomNumber } = req.body;

    const getSuggestions = async (fId, d, t) => {
        const busySlots = await Timetable.find({ facultyId: fId, day: d }).select('time');
        const busyTimeSet = new Set(busySlots.map(s => s.time));
        const freeSessions = ALL_TIME_SLOTS.filter(slot => !busyTimeSet.has(slot));

        const busyFacultyEntries = await Timetable.find({ day: d, time: t }).select('facultyId');
        const busyFacultyIds = busyFacultyEntries.map(e => e.facultyId.toString());
        const allFaculty = await Faculty.find({});
        const freeFaculty = allFaculty.filter(f => !busyFacultyIds.includes(f._id.toString()));

        return { freeSessions, freeFaculty };
    };

    // Faculty Clash Detection
    const facultyClash = await Timetable.findOne({ facultyId, day, time });
    if (facultyClash) {
        await ClashLog.create({
            facultyId, subjectId, day, time, roomNumber,
            clashType: 'Faculty',
            message: 'Faculty is already busy in another session.'
        });

        const { freeSessions, freeFaculty } = await getSuggestions(facultyId, day, time);

        return res.status(400).json({
            message: 'Faculty Clash Detected: This teacher is already scheduled for this time slot.',
            freeSessions,
            freeFaculty
        });
    }

    // Room Clash Detection
    const roomClash = await Timetable.findOne({ roomNumber, day, time }).populate('facultyId').populate('subjectId');
    if (roomClash) {
        await ClashLog.create({
            facultyId, subjectId, day, time, roomNumber,
            clashType: 'Room',
            message: 'Classroom is already occupied by another faculty.'
        });

        const { freeSessions, freeFaculty } = await getSuggestions(facultyId, day, time);

        return res.status(400).json({
            message: `Room Clash Detected: "${roomClash.facultyId?.name}" is already teaching "${roomClash.subjectId?.name}" in this room.`,
            freeSessions,
            freeFaculty
        });
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
