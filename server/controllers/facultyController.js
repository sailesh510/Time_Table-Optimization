const Faculty = require('../models/Faculty');

const getFaculties = async (req, res) => {
    const faculties = await Faculty.find({});
    res.json(faculties);
};

const createFaculty = async (req, res) => {
    const { name, department } = req.body;
    const faculty = new Faculty({ name, department });
    const createdFaculty = await faculty.save();
    res.status(201).json(createdFaculty);
};

const updateFaculty = async (req, res) => {
    const { name, department } = req.body;
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
        faculty.name = name;
        faculty.department = department;
        const updatedFaculty = await faculty.save();
        res.json(updatedFaculty);
    } else {
        res.status(404).json({ message: 'Faculty not found' });
    }
};

const deleteFaculty = async (req, res) => {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
        await Faculty.deleteOne({ _id: req.params.id });
        res.json({ message: 'Faculty removed' });
    } else {
        res.status(404).json({ message: 'Faculty not found' });
    }
};

module.exports = { getFaculties, createFaculty, updateFaculty, deleteFaculty };
