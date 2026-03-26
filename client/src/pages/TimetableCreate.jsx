import React, { useEffect, useState } from 'react';
import { fetchFaculties, fetchSubjects, addTimetable } from '../services/api';
import { FaClock, FaUserTie, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const TimetableCreate = () => {
    const [faculties, setFaculties] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        facultyId: '',
        subjectId: '',
        day: 'Monday',
        time: '09:00 - 10:00',
        roomNumber: '',
    });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [freeSessions, setFreeSessions] = useState([]);
    const [freeFaculty, setFreeFaculty] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const f = await fetchFaculties();
            const s = await fetchSubjects();
            setFaculties(f.data);
            setSubjects(s.data);
        };
        loadData();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slots = [
        '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 01:00', '02:00 - 03:00', '03:00 - 04:00', '04:00 - 05:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        setFreeSessions([]);
        setFreeFaculty([]);
        try {
            await addTimetable(formData);
            setMsg({ type: 'success', text: 'Timetable entry added successfully!' });
        } catch (err) {
            const data = err.response?.data;
            setMsg({ type: 'danger', text: data?.message || 'Error occurred' });
            if (data?.freeSessions) setFreeSessions(data.freeSessions);
            if (data?.freeFaculty) setFreeFaculty(data.freeFaculty);
        }
    };

    const handlePickSession = (slot) => {
        setFormData({ ...formData, time: slot });
        setMsg({ type: 'info', text: `Time slot changed to "${slot}". Click Save to try again.` });
        setFreeSessions([]);
        setFreeFaculty([]);
    };

    const handlePickFaculty = (faculty) => {
        setFormData({ ...formData, facultyId: faculty._id });
        setMsg({ type: 'info', text: `Faculty changed to "${faculty.name}". Click Save to try again.` });
        setFreeSessions([]);
        setFreeFaculty([]);
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Create Timetable</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        {msg.text && (
                            <div className={`alert alert-${msg.type} d-flex align-items-center`}>
                                {msg.type === 'success' && <FaCheckCircle className="me-2" />}
                                {msg.type === 'danger' && <FaExclamationTriangle className="me-2" />}
                                {msg.text}
                            </div>
                        )}

                        {/* Suggestions Panel */}
                        {(freeSessions.length > 0 || freeFaculty.length > 0) && (
                            <div className="card border-warning mb-3" style={{ background: '#fffbeb' }}>
                                <div className="card-body">
                                    {freeSessions.length > 0 && (
                                        <div className="mb-3">
                                            <h6 className="fw-bold text-dark mb-2">
                                                <FaClock className="me-2 text-success" />
                                                Free Sessions (same day, same faculty)
                                            </h6>
                                            <p className="text-muted small mb-2">Click a slot to auto-fill</p>
                                            <div className="d-flex flex-wrap gap-2">
                                                {freeSessions.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                                                        onClick={() => handlePickSession(slot)}
                                                        style={{ transition: 'all 0.2s' }}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {freeSessions.length === 0 && (
                                        <div className="mb-3">
                                            <h6 className="fw-bold text-danger mb-1">
                                                <FaClock className="me-2" />
                                                No free sessions available for this faculty on this day
                                            </h6>
                                        </div>
                                    )}
                                    {freeFaculty.length > 0 && (
                                        <div>
                                            <h6 className="fw-bold text-dark mb-2">
                                                <FaUserTie className="me-2 text-primary" />
                                                Available Faculty (same day & time)
                                            </h6>
                                            <p className="text-muted small mb-2">Click a faculty to auto-fill</p>
                                            <div className="list-group list-group-flush">
                                                {freeFaculty.map(f => (
                                                    <button
                                                        key={f._id}
                                                        type="button"
                                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 rounded mb-1"
                                                        onClick={() => handlePickFaculty(f)}
                                                        style={{ background: '#f0f7ff', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    >
                                                        <span className="fw-bold">{f.name}</span>
                                                        <span className="badge bg-secondary rounded-pill">{f.department}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {freeFaculty.length === 0 && (
                                        <div>
                                            <h6 className="fw-bold text-danger mb-1">
                                                <FaUserTie className="me-2" />
                                                No other faculty available at this time slot
                                            </h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Select Faculty</label>
                                <select
                                    className="form-select"
                                    value={formData.facultyId}
                                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {faculties.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Select Subject</label>
                                <select
                                    className="form-select"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Select Day</label>
                                <select
                                    className="form-select"
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Select Time Slot</label>
                                <select
                                    className="form-select"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                >
                                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Class Room Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Room 101, Lab A"
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Save Timetable</button>
                        </form>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card bg-light border-0 p-4 h-100">
                        <h5>Clash Detection Info</h5>
                        <p className="text-muted">The system automatically checks for overlapping schedules for the same faculty. If a clash is detected, the entry will be blocked and you will see an alert.</p>
                        <div className="mt-4 p-3 bg-white rounded shadow-sm">
                            <p className="mb-1 fw-bold">Example Clash:</p>
                            <p className="small text-danger m-0">Faculty "Dr. Smith" already assigned to 09:00 - 10:00 on Monday.</p>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded shadow-sm">
                            <p className="mb-1 fw-bold text-success">💡 Smart Suggestions:</p>
                            <p className="small text-muted m-0">When a clash occurs, the system will show you which time slots are free for the faculty, and which other faculty are available at the selected time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableCreate;

