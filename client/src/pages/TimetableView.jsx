import React, { useEffect, useState } from 'react';
import { fetchTimetables, deleteTimetable } from '../services/api';
import { FaTrash, FaSearch, FaCalendarAlt, FaClock, FaUserGraduate, FaBook, FaDoorOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TimetableView = () => {
    const [timetables, setTimetables] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTimetables = async () => {
        try {
            setLoading(true);
            const { data } = await fetchTimetables();
            setTimetables(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            console.error('Failed to load timetables:', err);
            setError('Failed to load timetable data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimetables();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await deleteTimetable(id);
                loadTimetables();
            } catch (err) {
                alert('Failed to delete entry');
            }
        }
    };

    const filtered = timetables.filter(t => {
        const search = searchTerm.toLowerCase();
        const facultyName = t.facultyId?.name?.toLowerCase() || '';
        const subjectName = t.subjectId?.name?.toLowerCase() || '';
        const subjectCode = t.subjectId?.code?.toLowerCase() || '';
        const day = t.day?.toLowerCase() || '';
        const room = t.roomNumber?.toLowerCase() || '';

        return facultyName.includes(search) ||
            subjectName.includes(search) ||
            subjectCode.includes(search) ||
            day.includes(search) ||
            room.includes(search);
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="d-flex justify-content-between align-items-center mb-4"
            >
                <div>
                    <h2 className="fw-bold m-0 text-dark">University Timetable</h2>
                    <p className="text-muted small mb-0">Manage and view scheduled academic sessions</p>
                </div>
                <div className="input-group w-50" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text bg-white border-end-0 border-0 shadow-sm" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                        <FaSearch className="text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control border-0 shadow-sm ps-0"
                        placeholder="Search faculty, subject, or day..."
                        style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px', padding: '12px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {error && <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">{error}</div>}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-uppercase small fw-bold text-muted"> <FaUserGraduate className="me-2" /> Faculty Name</th>
                                <th className="px-4 py-3 text-uppercase small fw-bold text-muted"> <FaBook className="me-2" /> Subject</th>
                                <th className="px-4 py-3 text-uppercase small fw-bold text-muted"> <FaCalendarAlt className="me-2" /> Schedule</th>
                                <th className="px-4 py-3 text-uppercase small fw-bold text-muted"> <FaDoorOpen className="me-2" /> Room</th>
                                <th className="px-4 py-3 text-uppercase small fw-bold text-muted text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.length > 0 ? (
                                    filtered.map((t, index) => (
                                        <motion.tr
                                            key={t._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-bottom"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-primary-soft text-primary rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'rgba(78, 115, 223, 0.1)' }}>
                                                        {t.facultyId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{t.facultyId?.name || 'Unknown Faculty'}</div>
                                                        <div className="text-muted mini-text" style={{ fontSize: '0.75rem' }}>{t.facultyId?.department || 'General'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="fw-600 text-dark">{t.subjectId?.name || 'N/A'}</div>
                                                <div className="badge bg-secondary-soft text-secondary" style={{ fontSize: '0.7rem', background: '#f8f9fc' }}>{t.subjectId?.code}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaCalendarAlt className="text-primary me-2 scale-8" />
                                                    <span className="fw-bold">{t.day}</span>
                                                </div>
                                                <div className="d-flex align-items-center text-muted small">
                                                    <FaClock className="me-2 scale-8" />
                                                    {t.time}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="badge rounded-pill bg-dark py-2 px-3">
                                                    Room {t.roomNumber}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    className="btn btn-icon btn-outline-danger border-0 rounded-circle"
                                                    onClick={() => handleDelete(t._id)}
                                                    style={{ width: '36px', height: '36px', padding: 0 }}
                                                    title="Remove session"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="text-muted">
                                                <FaCalendarAlt size={40} className="mb-3 opacity-25" />
                                                <h5>No sessions found</h5>
                                                <p className="small">Try adjusting your search filters or add a new timetable entry.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimetableView;

