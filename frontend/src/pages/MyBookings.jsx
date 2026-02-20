import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, 
    User, 
    Clock, 
    Mail, 
    CheckCircle, 
    XCircle, 
    Clock as PendingIcon,
    Search,
    BookOpen,
    Filter,
    Download,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

const MyBookings = () => {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');

    // Save email to localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('bookingEmail');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings?email=${email}`);
            setBookings(res.data);
            setHasSearched(true);
            localStorage.setItem('bookingEmail', email);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
            console.error("Error fetching bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': {
                icon: PendingIcon,
                color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                iconColor: 'text-yellow-500'
            },
            'Confirmed': {
                icon: CheckCircle,
                color: 'bg-green-50 text-green-700 border-green-200',
                iconColor: 'text-green-500'
            },
            'Completed': {
                icon: CheckCircle,
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                iconColor: 'text-blue-500'
            },
            'Cancelled': {
                icon: XCircle,
                color: 'bg-red-50 text-red-700 border-red-200',
                iconColor: 'text-red-500'
            }
        };
        
        const config = statusConfig[status] || statusConfig['Pending'];
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
                <Icon size={14} className={config.iconColor} />
                {status}
            </span>
        );
    };

    const filteredBookings = bookings
        .filter(b => filterStatus === 'all' ? true : b.status === filterStatus)
        .sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        confirmed: bookings.filter(b => b.status === 'Confirmed').length,
        completed: bookings.filter(b => b.status === 'Completed').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                            <p className="text-gray-600 mt-1">Track and manage your session bookings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Email Search Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-xl font-semibold text-white">Find Your Bookings</h2>
                        <p className="text-blue-100 mt-1">Enter the email you used for booking</p>
                    </div>
                    
                    <div className="p-8">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="john.doe@example.com" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className={`
                                    px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold
                                    transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                    flex items-center justify-center gap-2
                                    ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} />
                                        <span>Find Sessions</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700 border border-red-200">
                                <AlertCircle size={20} />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {hasSearched && (
                    <>
                        {/* Stats Cards */}
                        {bookings.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500">Confirmed</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                                </div>
                            </div>
                        )}

                        {/* Filters and Sort */}
                        {bookings.length > 0 && (
                            <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-600">Filter:</span>
                                    <select 
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Sort by:</span>
                                    <select 
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Bookings List */}
                        <div className="space-y-4">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking, index) => (
                                    <div 
                                        key={booking._id} 
                                        className="group bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                {/* Booking Info */}
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                                        <User size={24} className="text-blue-600" />
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">
                                                            {booking.expertId?.name || "Expert Session"}
                                                        </h3>
                                                        
                                                        <div className="flex flex-wrap gap-4 mt-2">
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                <Calendar size={14} className="text-gray-400" />
                                                                <span>{new Date(booking.date).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                <Clock size={14} className="text-gray-400" />
                                                                <span>{booking.time}</span>
                                                            </div>
                                                            
                                                            {booking.expertId?.category && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                        {booking.expertId.category}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Additional Details */}
                                                        <div className="mt-3 text-sm text-gray-500">
                                                            <p>Booking ID: {booking._id.slice(-8)}</p>
                                                            {booking.notes && (
                                                                <p className="mt-1 italic">"{booking.notes}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status and Actions */}
                                                <div className="flex flex-col items-end gap-3">
                                                    {getStatusBadge(booking.status)}
                                                    
                                                    <button 
                                                        onClick={() => {/* Handle view details */}}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        View Details
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Bar for Booking Status */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1 flex-1 rounded-full ${
                                                        booking.status === 'Pending' ? 'bg-yellow-200' :
                                                        booking.status === 'Confirmed' ? 'bg-green-200' :
                                                        'bg-blue-200'
                                                    }`}>
                                                        <div className={`h-1 rounded-full ${
                                                            booking.status === 'Pending' ? 'w-1/3 bg-yellow-500' :
                                                            booking.status === 'Confirmed' ? 'w-2/3 bg-green-500' :
                                                            'w-full bg-blue-500'
                                                        }`}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {booking.status === 'Pending' ? 'Awaiting confirmation' :
                                                         booking.status === 'Confirmed' ? 'Session confirmed' :
                                                         'Session completed'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                                    <p className="text-gray-500 mb-6">
                                        {bookings.length > 0 
                                            ? `No ${filterStatus} bookings match your filter.` 
                                            : "We couldn't find any bookings for this email address."}
                                    </p>
                                    {bookings.length > 0 && filterStatus !== 'all' && (
                                        <button
                                            onClick={() => setFilterStatus('all')}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                    {bookings.length === 0 && (
                                        <button
                                            onClick={() => navigate('/')}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Browse Experts
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Initial State */}
                {!hasSearched && !loading && (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <Mail size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter your email to continue</h3>
                        <p className="text-gray-500">We'll show you all your upcoming and past sessions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;