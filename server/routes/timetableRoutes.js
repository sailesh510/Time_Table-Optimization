const express = require('express');
const router = express.Router();
const { getTimetables, createTimetable, deleteTimetable, getStats, getClashLogs } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTimetables).post(protect, createTimetable);
router.route('/stats').get(protect, getStats);
router.route('/clash-reports').get(protect, getClashLogs);
router.route('/:id').delete(protect, deleteTimetable);

module.exports = router;
