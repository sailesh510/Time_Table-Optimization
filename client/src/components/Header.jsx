import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
    const { user } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg top-navbar px-4">
            <div className="d-flex align-items-center">
                <FaBars className="sidebar-toggle-btn me-3" onClick={toggleSidebar} />
                <h4 className="m-0 text-white fw-bold">Digital Faculty Timetable Optimization</h4>
            </div>
            <div className="ms-auto d-flex align-items-center">
                <div className="dropdown">
                    <button className="btn dropdown-toggle d-flex align-items-center profile-dropdown" type="button" data-bs-toggle="dropdown">
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=4e73df&color=fff'}
                            alt="Profile"
                            className="rounded-circle me-2"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <span>{user ? user.name : 'Admin'}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
