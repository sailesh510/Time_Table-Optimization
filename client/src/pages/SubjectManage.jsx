import React, { useEffect, useState } from 'react';
import { fetchSubjects, addSubject, deleteSubject } from '../services/api';
import { FaTrash, FaPlus, FaBook, FaCode, FaBuilding, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectManage = () => {
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [dept, setDept] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const { data } = await fetchSubjects();
            setSubjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addSubject({ name, code, department: dept });
            setName('');
            setCode('');
            setDept('');
            loadSubjects();
        } catch (err) {
            alert('Error adding subject');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this subject?')) {
            try {
                await deleteSubject(id);
                loadSubjects();
            } catch (err) {
                alert('Error deleting subject');
            }
        }
    };

    const filtered = subjects.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <h2 className="fw-bold m-0">Subject Management</h2>
                <p className="text-muted">Maintain the university curriculum catalog</p>
            </motion.div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card border-0 shadow-sm p-4 rounded-4"
                    >
                        <h5 className="fw-bold mb-4">Add New Subject</h5>
                        <form onSubmit={handleAdd}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">SUBJECT NAME</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaBook className="text-primary" /></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="Data Structures"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">COURSE CODE</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaCode className="text-primary" /></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="CS101"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">DEPARTMENT</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaBuilding className="text-primary" /></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="Engineering"
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-bold">
                                <FaPlus className="me-2" /> Register Subject
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="p-4 bg-white border-bottom">
                            <div className="input-group w-50">
                                <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="Search subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Code</th>
                                        <th className="px-4 py-3 border-0">Subject Name</th>
                                        <th className="px-4 py-3 border-0">Department</th>
                                        <th className="px-4 py-3 border-0 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filtered.map((s, index) => (
                                            <motion.tr
                                                key={s._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <td className="px-4 py-3">
                                                    <span className="badge bg-secondary-soft text-secondary p-2" style={{ background: '#f8f9fc', letterSpacing: '1px' }}>{s.code}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{s.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-muted">{s.department}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                                                        onClick={() => handleDelete(s._id)}
                                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {!loading && filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">No subject records found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectManage;

