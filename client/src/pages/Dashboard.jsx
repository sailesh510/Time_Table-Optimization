import React, { useEffect, useState } from 'react';
import { fetchStats } from '../services/api';
import { FaUserTie, FaBook, FaCalendarAlt, FaExclamationTriangle, FaChartLine, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalFaculty: 0, totalSubjects: 0, totalEntries: 0, clashCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                setLoading(true);
                const { data } = await fetchStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    const cardData = [
        { title: 'Total Faculty', count: stats.totalFaculty, icon: <FaUserTie />, color: 'blue-gradient', delay: 0 },
        { title: 'Total Subjects', count: stats.totalSubjects, icon: <FaBook />, color: 'purple-gradient', delay: 0.1 },
        { title: 'Schedule Entries', count: stats.totalEntries, icon: <FaCalendarAlt />, color: 'green-gradient', delay: 0.2 },
        { title: 'Clash Reports', count: stats.clashCount, icon: <FaExclamationTriangle />, color: 'red-gradient', delay: 0.3 },
    ];

    const barData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
            {
                label: 'Sessions',
                data: [8, 12, 11, 9, 10],
                backgroundColor: 'rgba(78, 115, 223, 0.8)',
                borderRadius: 8,
                barThickness: 20,
            },
        ],
    };

    const pieData = {
        labels: ['CS', 'EE', 'ME', 'Civil'],
        datasets: [
            {
                data: [45, 25, 15, 15],
                backgroundColor: [
                    '#4e73df',
                    '#1cc88a',
                    '#36b9cc',
                    '#f6c23e',
                ],
                borderWidth: 0,
            },
        ],
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="container-fluid p-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
            >
                <h2 className="fw-bold m-0 text-dark">System Overview</h2>
                <p className="text-muted">Real-time statistics for the Timetable System</p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="row mb-4"
            >
                {cardData.map((card, index) => (
                    <div className="col-xl-3 col-md-6 mb-4" key={index}>
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className={`card border-0 shadow-sm h-100 py-2 stat-card ${card.color}`}
                        >
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-uppercase mb-1 opacity-75 small">
                                            {card.title}
                                        </div>
                                        <div className="h4 mb-0 font-weight-bold text-white">
                                            {loading ? '...' : card.count}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <div className="fs-2 opacity-50 text-white">{card.icon}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </motion.div>

            <div className="row">
                <div className="col-xl-8 col-lg-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card border-0 shadow-sm mb-4 rounded-4"
                    >
                        <div className="card-header bg-white py-3 d-flex flex-row align-items-center justify-content-between border-0 rounded-top-4">
                            <h6 className="m-0 font-weight-bold text-primary"><FaChartLine className="me-2" /> Weekly Distribution</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area" style={{ height: '300px' }}>
                                <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="col-xl-4 col-lg-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card border-0 shadow-sm mb-4 rounded-4"
                    >
                        <div className="card-header bg-white py-3 d-flex flex-row align-items-center justify-content-between border-0 rounded-top-4">
                            <h6 className="m-0 font-weight-bold text-primary"><FaUsers className="me-2" /> Workload per Dept</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-pie pt-4 pb-2" style={{ height: '300px' }}>
                                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

