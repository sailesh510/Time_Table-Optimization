const Subject = require('../models/Subject');

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects' });
    }
};

const createSubject = async (req, res) => {
    try {
        const { name, code, department } = req.body;
        if (!name || !code || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const subject = new Subject({ name, code, department });
        const createdSubject = await subject.save();
        res.status(201).json(createdSubject);
    } catch (error) {
        res.status(500).json({ message: 'Error adding subject' });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (subject) {
            await Subject.deleteOne({ _id: req.params.id });
            res.json({ message: 'Subject removed' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subject' });
    }
};

module.exports = { getSubjects, createSubject, deleteSubject };
