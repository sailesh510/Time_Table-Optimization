import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaTh, FaUserTie, FaBook, FaPlusCircle,
    FaCalendarAlt, FaFileAlt, FaExclamationTriangle, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
    const { user, logoutUser } = useContext(AuthContext);

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <FaTh /> },
        { path: '/faculty', name: 'Manage Faculty', icon: <FaUserTie /> },
        { path: '/subjects', name: 'Manage Subjects', icon: <FaBook /> },
        { path: '/create-timetable', name: 'Create Timetable', icon: <FaPlusCircle /> },
        { path: '/view-timetable', name: 'View Timetable', icon: <FaCalendarAlt /> },
        { path: '/reports', name: 'Reports', icon: <FaFileAlt /> },
        { path: '/clash-alerts', name: 'Clash Alerts', icon: <FaExclamationTriangle /> },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header pb-0">
                <h3 className="mb-3">Admin Panel</h3>
                {isOpen && (
                    <div className="admin-profile-section text-center mb-4 animate__animated animate__fadeIn">
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=4e73df&color=fff'}
                            alt="Admin"
                            className="rounded-circle border border-2 border-white shadow-sm mb-2"
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        />
                        <h6 className="text-white m-0 fw-bold">{user?.name || 'Admin User'}</h6>
                        <small className="text-white-50">System Administrator</small>
                    </div>
                )}
            </div>
            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="icon">{item.icon}</div>
                        <div className="link_text">{item.name}</div>
                    </NavLink>
                ))}
                <div className="menu-item logout-btn" onClick={logoutUser}>
                    <div className="icon"><FaSignOutAlt /></div>
                    <div className="link_text">Logout</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
