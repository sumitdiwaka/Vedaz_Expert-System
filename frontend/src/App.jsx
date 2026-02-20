import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-blue-600">ExpertBook</h1>
          <div className="space-x-4">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/my-bookings" className="hover:text-blue-600">My Bookings</a>
          </div>
        </nav> */}
        <Routes>
          <Route path="/" element={<ExpertListing />} />
          <Route path="/expert/:id" element={<ExpertDetail />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;