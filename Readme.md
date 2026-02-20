🚀 ExpertBook: Real-Time Session Booking System
ExpertBook is a full-stack MERN application designed for seamless expert-client consultations. It features real-time slot management, robust booking validation, and a modern, responsive UI built with Vite and Tailwind CSS.

Live Link:-https://vedaz-expert-system.vercel.app

✨ Key Features
Real-Time Slot Updates: Utilizing Socket.io to instantly disable booked slots across all connected clients without page refreshes.

Race Condition Protection: Implements MongoDB unique compound indexes to prevent double-bookings at the database level.

Expert Discovery: Search by name, filter by category, and paginated expert listings for optimal performance.

Booking Management: Users can track their booking status (Pending, Confirmed, Completed) by searching with their email.

Modern UI: Built with React (Vite), Tailwind CSS v4, and Lucide-React icons for a premium user experience.

🛠️ Tech Stack
Frontend: React.js (Vite), Tailwind CSS v4, Axios, React Router Dom, Socket.io-client.

Backend: Node.js, Express.js.

Database: MongoDB (Mongoose) with Unique Indexing.

Real-Time: Socket.io.

Icons: Lucide-React.

⚙️ Project Structure
Plaintext
├── backend/
│   ├── config/             # Database connection logic
│   ├── controllers/        # Business logic & API handlers
│   ├── models/             # Mongoose schemas (Expert, Booking)
│   ├── routes/             # API endpoint definitions
│   ├── seed.js             # Script to populate initial data
│   └── server.js           # Main entry point with Socket.io setup
└── frontend/
    ├── src/
    │   ├── components/     # Shared UI components
    │   ├── pages/          # Application screens
    │   ├── socket.js       # Global socket connection
    │   └── App.jsx         # Routing and Layout
🚀 Getting Started
1. Prerequisites
Node.js (v18+ recommended)

MongoDB Atlas account or local MongoDB instance

2. Backend Setup
Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file and add your credentials:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
Seed the Database: Run npm run seed to populate experts.

Start the server: npm run dev

3. Frontend Setup
Navigate to the frontend directory: cd frontend

Install dependencies: npm install

Start the development server: npm run dev

Open http://localhost:5173 in your browser.

🛡️ Critical Implementation Details
Preventing Double Booking
To handle high-concurrency scenarios, the system uses a Compound Unique Index in MongoDB:

JavaScript
bookingSchema.index({ expertId: 1, date: 1, time: 1 }, { unique: true });
This ensures that even if two requests arrive simultaneously, the database will only allow one successful write for the same expert, date, and time.

Real-Time Synchronization
When a booking is confirmed, the backend emits a slotBooked event. All active clients listening to this event update their state immediately:

JavaScript
socket.on('slotBooked', (data) => {
    // Update local state to disable slot instantly
});
👨‍💻 Author