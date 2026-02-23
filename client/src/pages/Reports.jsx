import React, { useEffect, useState } from 'react';
import { fetchTimetables } from '../services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaDownload, FaFilePdf } from 'react-icons/fa';

const Reports = () => {
    const [timetables, setTimetables] = useState([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await fetchTimetables();
            setTimetables(data);
        };
        load();
    }, []);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('Faculty Timetable Report', 14, 15);

        const tableData = timetables.map(t => [
            t.facultyId.name,
            t.subjectId.name,
            t.day,
            t.time,
            t.roomNumber
        ]);

        doc.autoTable({
            head: [['Faculty', 'Subject', 'Day', 'Time', 'Room']],
            body: tableData,
            startY: 20,
        });

        doc.save('timetable_report.pdf');
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Reports & Export</h2>
                <button className="btn btn-danger d-flex align-items-center" onClick={exportPDF}>
                    <FaFilePdf className="me-2" /> Export to PDF
                </button>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm p-4 text-center">
                        <FaDownload className="fs-1 text-primary mb-3 mx-auto" />
                        <h5>Timetable Summary</h5>
                        <p className="text-muted small">Generate a clean PDF report of the entire schedule.</p>
                        <button className="btn btn-primary" onClick={exportPDF}>Download</button>
                    </div>
                </div>
            </div>

            <div className="mt-4 card shadow-sm p-4">
                <h5>Preview</h5>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Subject</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetables.map(t => (
                            <tr key={t._id}>
                                <td>{t.facultyId.name}</td>
                                <td>{t.subjectId.name}</td>
                                <td>{t.day}</td>
                                <td>{t.time}</td>
                                <td>{t.roomNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
