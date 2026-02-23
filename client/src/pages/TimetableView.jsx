import React, { useEffect, useState } from 'react';
import { fetchTimetables, deleteTimetable } from '../services/api';
import { FaTrash, FaSearch } from 'react-icons/fa';

const TimetableView = () => {
    const [timetables, setTimetables] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadTimetables = async () => {
        const { data } = await fetchTimetables();
        setTimetables(data);
    };

    useEffect(() => {
        loadTimetables();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteTimetable(id);
            loadTimetables();
        }
    };

    const filtered = timetables.filter(t =>
        t.facultyId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subjectId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">View Timetable</h2>
                <div className="input-group w-25">
                    <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card shadow-sm overflow-hidden">
                <table className="table m-0">
                    <thead className="bg-light">
                        <tr>
                            <th>Faculty</th>
                            <th>Subject</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Room</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t._id}>
                                <td>{t.facultyId.name}</td>
                                <td>{t.subjectId.name} ({t.subjectId.code})</td>
                                <td>{t.day}</td>
                                <td>{t.time}</td>
                                <td>{t.roomNumber}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimetableView;
