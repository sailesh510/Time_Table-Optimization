const Faculty = require('../models/Faculty');

const getFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find({});
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculties' });
    }
};

const createFaculty = async (req, res) => {
    try {
        const { name, department } = req.body;
        if (!name || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const faculty = new Faculty({ name, department });
        const createdFaculty = await faculty.save();
        res.status(201).json(createdFaculty);
    } catch (error) {
        res.status(500).json({ message: 'Error adding faculty' });
    }
};

const updateFaculty = async (req, res) => {
    try {
        const { name, department } = req.body;
        const faculty = await Faculty.findById(req.params.id);
        if (faculty) {
            faculty.name = name || faculty.name;
            faculty.department = department || faculty.department;
            const updatedFaculty = await faculty.save();
            res.json(updatedFaculty);
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating faculty' });
    }
};

const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (faculty) {
            await Faculty.deleteOne({ _id: req.params.id });
            res.json({ message: 'Faculty removed' });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting faculty' });
    }
};

module.exports = { getFaculties, createFaculty, updateFaculty, deleteFaculty };
