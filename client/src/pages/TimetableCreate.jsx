import React, { useEffect, useState } from 'react';
import { fetchFaculties, fetchSubjects, addTimetable } from '../services/api';

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
        try {
            await addTimetable(formData);
            setMsg({ type: 'success', text: 'Timetable entry added successfully!' });
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.message || 'Error occurred' });
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Create Timetable</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableCreate;
