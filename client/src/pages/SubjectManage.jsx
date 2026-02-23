import React, { useEffect, useState } from 'react';
import { fetchSubjects, addSubject, deleteSubject } from '../services/api';
import { FaTrash, FaPlus } from 'react-icons/fa';

const SubjectManage = () => {
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [dept, setDept] = useState('');

    const loadSubjects = async () => {
        const { data } = await fetchSubjects();
        setSubjects(data);
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addSubject({ name, code, department: dept });
        setName('');
        setCode('');
        setDept('');
        loadSubjects();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteSubject(id);
            loadSubjects();
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold">Manage Subjects</h2>

            <div className="card shadow-sm p-4 mb-4">
                <form onSubmit={handleAdd} className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Subject Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Subject Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Department"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary w-100"><FaPlus /> Add</button>
                    </div>
                </form>
            </div>

            <div className="card shadow-sm overflow-hidden">
                <table className="table m-0">
                    <thead className="bg-light">
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((s) => (
                            <tr key={s._id}>
                                <td>{s.code}</td>
                                <td>{s.name}</td>
                                <td>{s.department}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>
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

export default SubjectManage;
