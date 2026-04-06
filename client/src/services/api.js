import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

API.interceptors.request.use((req) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const fetchFaculties = () => API.get('/faculty');
export const addFaculty = (data) => API.post('/faculty', data);
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);
export const updateFaculty = (id, data) => API.put(`/faculty/${id}`, data);

export const fetchSubjects = () => API.get('/subject');
export const addSubject = (data) => API.post('/subject', data);
export const deleteSubject = (id) => API.delete(`/subject/${id}`);

export const fetchTimetables = () => API.get('/timetable');
export const addTimetable = (data) => API.post('/timetable', data);
export const deleteTimetable = (id) => API.delete(`/timetable/${id}`);
export const fetchStats = () => API.get('/timetable/stats');
export const fetchClashLogs = () => API.get('/timetable/clash-reports');

export default API;
