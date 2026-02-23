const express = require('express');
const router = express.Router();
const { getFaculties, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFaculties).post(protect, createFaculty);
router.route('/:id').put(protect, updateFaculty).delete(protect, deleteFaculty);

module.exports = router;
