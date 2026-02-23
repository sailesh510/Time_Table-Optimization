import React, { useEffect, useState } from 'react';
import { fetchStats } from '../services/api';
import { FaUserTie, FaBook, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
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
    LineElement
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
    LineElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalFaculty: 0, totalSubjects: 0, totalEntries: 0, clashCount: 0 });

    useEffect(() => {
        const getStats = async () => {
            try {
                const { data } = await fetchStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        getStats();
    }, []);

    const cardData = [
        { title: 'Total Faculty', count: stats.totalFaculty, icon: <FaUserTie />, color: 'blue-gradient' },
        { title: 'Total Subjects', count: stats.totalSubjects, icon: <FaBook />, color: 'purple-gradient' },
        { title: 'Timetable Entries', count: stats.totalEntries, icon: <FaCalendarAlt />, color: 'green-gradient' },
        { title: 'Clash Count', count: stats.clashCount, icon: <FaExclamationTriangle />, color: 'red-gradient' },
    ];

    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Sessions per Day',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    const pieData = {
        labels: ['CS', 'EE', 'ME', 'CE'],
        datasets: [
            {
                data: [12, 19, 3, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
            },
        ],
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

            <div className="row mb-4">
                {cardData.map((card, index) => (
                    <div className="col-md-3" key={index}>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className={`card stat-card ${card.color}`}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="m-0 opacity-75">{card.title}</p>
                                    <h3 className="m-0 fw-bold">{card.count}</h3>
                                </div>
                                <div className="fs-1 opacity-50">{card.icon}</div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-7">
                    <div className="card shadow-sm p-4 h-100">
                        <h5 className="mb-4 fw-bold">Weekly Distribution</h5>
                        <Bar data={barData} />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card shadow-sm p-4 h-100">
                        <h5 className="mb-4 fw-bold">Workload by Department</h5>
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
