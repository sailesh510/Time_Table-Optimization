# Digital Faculty Timetable Optimization System

A professional MERN-stack application for managing faculty schedules with automated clash detection.

## Features
- **Admin Authentication**: Secure JWT-based login and registration.
- **Admin Dashboard**: Real-time stats with Chart.js visualizations.
- **Faculty & Subject Management**: Complete CRUD operations.
- **Timetable Creation**: Intelligent clash detection to prevent overlapping schedules.
- **Reports**: Searchable timetable view and PDF export capability.
- **Premium UI**: Modern design with gradients, shadows, and responsiveness.

## Tech Stack
- **Frontend**: React.js, Vite, Bootstrap, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, Bcrypt

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Server Setup
1. Navigate to the `server` directory.
2. Run `npm install`.
3. Configure `.env` (already done).
4. Start the server: `npm start` (or `node server.js`).

### Client Setup
1. Navigate to the `client` directory.
2. Run `npm install`.
3. Start the development server: `npm run dev`.

## Clash Detection Logic
The system blocks any timetable entry if the same **faculty** is assigned a session on the same **day** and **time**. 

```javascript
const clash = await Timetable.findOne({ facultyId, day, time });
if (clash) return res.status(400).json({ message: 'Clash Detected' });
```
