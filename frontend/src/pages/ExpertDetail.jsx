import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../socket';
import { 
    Calendar, 
    Clock, 
    Star, 
    Briefcase, 
    ChevronLeft, 
    CheckCircle,
    AlertCircle,
    Award,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const ExpertDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expert, setExpert] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`http://localhost:5000/api/experts/${id}`);
                setExpert(res.data);
                
                // Set first available date as default
                if (res.data.slots && res.data.slots.length > 0) {
                    const dates = [...new Set(res.data.slots.map(s => s.date))];
                    setSelectedDate(dates[0]);
                }
            } catch (err) {
                setError('Failed to load expert details. Please try again.');
                console.error("Error fetching expert details", err);
            }
            setLoading(false);
        };
        fetchDetails();

        // LISTEN FOR REAL-TIME UPDATES
        socket.on('slotBooked', (data) => {
            if (data.expertId === id) {
                setExpert(prev => ({
                    ...prev,
                    slots: prev.slots.map(slot => 
                        (slot.date === data.date && slot.time === data.time) 
                        ? { ...slot, isBooked: true } 
                        : slot
                    )
                }));
            }
        });

        return () => {
            socket.off('slotBooked');
        };
    }, [id]);

    // Group slots by date
    const groupedSlots = expert?.slots?.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot);
        return acc;
    }, {});

    const availableDates = groupedSlots ? Object.keys(groupedSlots).sort() : [];

    const getAvailabilityStatus = () => {
        if (!expert?.slots) return { total: 0, available: 0 };
        const total = expert.slots.length;
        const available = expert.slots.filter(s => !s.isBooked).length;
        return { total, available };
    };

    const status = getAvailabilityStatus();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        {/* Header Skeleton */}
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !expert) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error || 'Expert not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Experts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation Bar */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
                        <span>Back to Experts</span>
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Expert Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    {/* Cover Image with Gradient */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    
                    <div className="px-8 pb-8">
                        {/* Profile Info */}
                        <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
                            <div className="flex items-end gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
                                    {expert.name?.charAt(0) || '👤'}
                                </div>
                                
                                <div className="mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                            {expert.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} className="fill-current" />
                                            <span className="text-gray-700 font-medium">{expert.rating}</span>
                                            <span className="text-gray-500 text-sm">/5.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Briefcase size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <p className="font-semibold">{expert.experience} Years</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Award size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Sessions</p>
                                        <p className="font-semibold">{expert.totalSessions || 150}+</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Available</p>
                                        <p className="font-semibold">{status.available} Slots</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Calendar size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Response Time</p>
                                        <p className="font-semibold">&lt; 2 hrs</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">
                                {expert.description || "Experienced professional ready to help you achieve your goals. Book a session for personalized guidance and expert advice."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Available Time Slots</h2>
                            <p className="text-gray-500 mt-1">Select a date and time for your session</p>
                        </div>
                        {status.available === 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg">
                                <AlertCircle size={18} />
                                <span className="font-medium">Fully Booked</span>
                            </div>
                        )}
                    </div>

                    {/* Date Tabs */}
                    {availableDates.length > 0 ? (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                                {availableDates.map((date) => {
                                    const slotsForDate = groupedSlots[date];
                                    const availableCount = slotsForDate.filter(s => !s.isBooked).length;
                                    const isSelected = selectedDate === date;
                                    
                                    return (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-lg border transition ${
                                                isSelected 
                                                    ? 'border-blue-600 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <p className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                            <p className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {new Date(date).getDate()}
                                            </p>
                                            <p className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                                                {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                                            </p>
                                            {availableCount > 0 && (
                                                <p className="text-xs mt-1 text-green-600">
                                                    {availableCount} slots
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Slots Grid */}
                            {selectedDate && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-700">
                                            {new Date(selectedDate).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {groupedSlots[selectedDate].filter(s => !s.isBooked).length} slots available
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {groupedSlots[selectedDate].map((slot, index) => (
                                            <button
                                                key={index}
                                                disabled={slot.isBooked}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`relative p-4 rounded-xl border-2 transition-all ${
                                                    slot.isBooked 
                                                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                        : selectedSlot === slot
                                                            ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                                                            : 'border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105'
                                                }`}
                                            >
                                                {slot.isBooked ? (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle size={16} className="text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-2 right-2">
                                                        <Clock size={16} className="text-blue-400" />
                                                    </div>
                                                )}
                                                <p className="text-lg font-bold text-gray-900">{slot.time}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {slot.isBooked ? 'Booked' : 'Available'}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No slots available</h3>
                            <p className="text-gray-500">Check back later for new time slots</p>
                        </div>
                    )}

                    {/* Booking CTA */}
                    {selectedSlot && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Selected Session</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={18} className="text-blue-600" />
                                            <span className="font-medium">{selectedSlot.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-blue-600" />
                                            <span className="font-medium">{selectedSlot.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate('/booking-form', { 
                                        state: { 
                                            expert: { 
                                                ...expert, 
                                                _id: expert._id,
                                                name: expert.name 
                                            }, 
                                            selectedSlot 
                                        } 
                                    })}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
                                >
                                    Continue to Book
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expert Details Footer */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-gray-600">{expert.email || 'expert@example.com'}</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                        <Phone size={20} className="text-gray-400" />
                        <span className="text-gray-600">{expert.phone || 'Contact for details'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDetail;