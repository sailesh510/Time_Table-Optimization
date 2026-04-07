import React, { useEffect, useState } from 'react';
import { fetchFaculties, addFaculty, deleteFaculty } from '../services/api';
import { FaTrash, FaPlus, FaUserTie, FaBuilding, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyManage = () => {
    const [faculties, setFaculties] = useState([]);
    const [name, setName] = useState('');
    const [dept, setDept] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadFaculties = async () => {
        try {
            setLoading(true);
            const { data } = await fetchFaculties();
            setFaculties(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaculties();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const { data } = await addFaculty({ name, department: dept });
            setName('');
            setDept('');
            loadFaculties();
            // Optional: Success feedback could be added here
        } catch (err) {
            console.error('Error adding faculty:', err);
            if (err.response && err.response.status !== 401) {
                alert(err.response.data.message || 'Error adding faculty');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this faculty member?')) {
            try {
                await deleteFaculty(id);
                loadFaculties();
            } catch (err) {
                alert('Error deleting faculty');
            }
        }
    };

    const filtered = faculties.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <h2 className="fw-bold m-0">Faculty Management</h2>
                <p className="text-muted">Register and organize teaching staff</p>
            </motion.div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card border-0 shadow-sm p-4 rounded-4"
                    >
                        <h5 className="fw-bold mb-4">Add New Faculty</h5>
                        <form onSubmit={handleAdd}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">FULL NAME</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaUserTie className="text-primary" /></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="Dr. John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        placeholder="Computer Science"
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-bold">
                                <FaPlus className="me-2" /> Add Faculty
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
                                    placeholder="Search faculty..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Name</th>
                                        <th className="px-4 py-3 border-0">Department</th>
                                        <th className="px-4 py-3 border-0 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filtered.map((f, index) => (
                                            <motion.tr
                                                key={f._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{f.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge bg-info-soft text-info" style={{ background: 'rgba(54, 185, 204, 0.1)' }}>{f.department}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                                                        onClick={() => handleDelete(f._id)}
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
                                            <td colSpan="3" className="text-center py-5 text-muted">No faculty records found</td>
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

export default FacultyManage;

