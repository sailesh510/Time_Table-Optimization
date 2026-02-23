const Subject = require('../models/Subject');

const getSubjects = async (req, res) => {
    const subjects = await Subject.find({});
    res.json(subjects);
};

const createSubject = async (req, res) => {
    const { name, code, department } = req.body;
    const subject = new Subject({ name, code, department });
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
};

const deleteSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
        await Subject.deleteOne({ _id: req.params.id });
        res.json({ message: 'Subject removed' });
    } else {
        res.status(404).json({ message: 'Subject not found' });
    }
};

module.exports = { getSubjects, createSubject, deleteSubject };
