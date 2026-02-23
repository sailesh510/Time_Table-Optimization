import React, { useEffect, useState } from 'react';
import { fetchClashLogs } from '../services/api';
import { FaExclamationTriangle, FaClock, FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClashAlerts = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const { data } = await fetchClashLogs();
                setLogs(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadLogs();
    }, []);

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Clash Alerts & History</h2>
            <p className="text-muted mb-4">This log shows all the scheduling attempts that were blocked by the system to prevent clashes.</p>

            {logs.length === 0 ? (
                <div className="card p-5 text-center shadow-sm">
                    <FaHistory className="fs-1 text-muted mb-3 mx-auto" />
                    <h4>No Clashes Recorded</h4>
                    <p className="text-muted">Congratulations! No scheduling conflicts have been attempted yet.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {logs.map((log) => (
                        <div className="col-md-6 col-lg-4" key={log._id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card h-100 border-start border-danger border-4 shadow-sm"
                            >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="badge bg-danger">
                                            {log.clashType} Clash
                                        </div>
                                        <div className="text-muted small d-flex align-items-center">
                                            <FaClock className="me-1" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <h5 className="card-title fw-bold text-dark">
                                        {log.facultyId?.name || 'Unknown Faculty'}
                                    </h5>
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        {log.subjectId?.name || 'Unknown Subject'}
                                    </h6>
                                    <div className="bg-light p-3 rounded mb-3">
                                        <p className="mb-1"><strong>Day:</strong> {log.day}</p>
                                        <p className="mb-1"><strong>Time:</strong> {log.time}</p>
                                        <p className="mb-0"><strong>Room:</strong> {log.roomNumber}</p>
                                    </div>
                                    <div className="d-flex align-items-center text-danger small">
                                        <FaExclamationTriangle className="me-2" />
                                        <span>{log.message}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClashAlerts;
