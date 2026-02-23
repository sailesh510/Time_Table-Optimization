import React, { useEffect, useState } from 'react';
import { fetchFaculties, addFaculty, deleteFaculty } from '../services/api';
import { FaTrash, FaPlus } from 'react-icons/fa';

const FacultyManage = () => {
    const [faculties, setFaculties] = useState([]);
    const [name, setName] = useState('');
    const [dept, setDept] = useState('');

    const loadFaculties = async () => {
        const { data } = await fetchFaculties();
        setFaculties(data);
    };

    useEffect(() => {
        loadFaculties();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addFaculty({ name, department: dept });
        setName('');
        setDept('');
        loadFaculties();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteFaculty(id);
            loadFaculties();
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Manage Faculty</h2>

            <div className="card shadow-sm p-4 mb-4">
                <form onSubmit={handleAdd} className="row g-3">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Faculty Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Department"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100"><FaPlus /> Add</button>
                    </div>
                </form>
            </div>

            <div className="card shadow-sm overflow-hidden">
                <table className="table m-0">
                    <thead className="bg-light">
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.map((f) => (
                            <tr key={f._id}>
                                <td>{f.name}</td>
                                <td>{f.department}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f._id)}>
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

export default FacultyManage;
