import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    FileText, 
    CheckCircle, 
    AlertCircle,
    ChevronLeft,
    Lock,
    Shield
} from 'lucide-react';

const BookingForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { expert, selectedSlot } = state || {};

    const [formData, setFormData] = useState({
        userName: '', 
        userEmail: '', 
        userPhone: '', 
        notes: ''
    });
    
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        // Redirect if no state
        if (!state) {
            navigate('/');
        }
    }, [state, navigate]);

    if (!state || !expert || !selectedSlot) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h2>
                    <p className="text-gray-600 mb-6">Please select an expert and time slot first.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Browse Experts
                    </button>
                </div>
            </div>
        );
    }

    const validateField = (name, value) => {
        switch (name) {
            case 'userName':
                return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            case 'userEmail':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email' : '';
            case 'userPhone':
                return !/^[\d\s\+\-\(\)]{10,}$/.test(value) ? 'Please enter a valid phone number' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'notes') { // notes are optional
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = {};
        Object.keys(formData).forEach(key => allTouched[key] = true);
        setTouched(allTouched);
        
        if (!validateForm()) {
            setStatus({ 
                type: 'error', 
                msg: 'Please fix the errors in the form before submitting.' 
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            await axios.post('http://localhost:5000/api/bookings', {
                ...formData,
                expertId: expert._id,
                expertName: expert.name,
                date: selectedSlot.date,
                time: selectedSlot.time
            });
            
            setStatus({ 
                type: 'success', 
                msg: 'Booking confirmed successfully! Redirecting to your bookings...' 
            });
            
            // Redirect after success
            setTimeout(() => navigate('/my-bookings'), 3000);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                msg: err.response?.data?.message || 'Booking failed. Please try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = (fieldName) => `
        w-full pl-10 pr-4 py-3 border rounded-lg transition-all
        ${touched[fieldName] && errors[fieldName] 
            ? 'border-red-300 bg-red-50 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
        }
        focus:border-transparent outline-none
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
                        <span>Back to Time Slots</span>
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
                        <p className="text-blue-100 mt-1">Secure your session with {expert.name}</p>
                    </div>

                    {/* Booking Summary Card */}
                    <div className="mx-8 mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <User size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Expert</p>
                                    <p className="font-medium text-gray-900">{expert.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <Calendar size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <Clock size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="font-medium text-gray-900">{selectedSlot.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <Shield size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="font-medium text-gray-900">60 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {status.msg && (
                        <div className={`mx-8 mt-4 p-4 rounded-lg flex items-center gap-3 ${
                            status.type === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {status.type === 'success' ? (
                                <CheckCircle size={20} className="flex-shrink-0" />
                            ) : (
                                <AlertCircle size={20} className="flex-shrink-0" />
                            )}
                            <p className="text-sm">{status.msg}</p>
                        </div>
                    )}

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="p-8 pt-6">
                        <div className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="userName"
                                        type="text"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClasses('userName')}
                                        placeholder="John Doe"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {touched.userName && errors.userName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                                )}
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="userEmail"
                                        type="email"
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClasses('userEmail')}
                                        placeholder="john@example.com"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {touched.userEmail && errors.userEmail && (
                                    <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="userPhone"
                                        type="tel"
                                        value={formData.userPhone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClasses('userPhone')}
                                        placeholder="+1 234 567 8900"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {touched.userPhone && errors.userPhone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.userPhone}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes <span className="text-gray-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        rows="3"
                                        placeholder="Any specific topics or questions you'd like to discuss?"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Privacy */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <Lock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-xs text-gray-500">
                                By confirming this booking, you agree to our{' '}
                                <button type="button" className="text-blue-600 hover:underline">Terms of Service</button>
                                {' '}and{' '}
                                <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>.
                                Your information is secure and will only be used for this booking.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                w-full mt-6 py-4 rounded-xl font-semibold text-white
                                transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                ${isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>

                        {/* Guarantee */}
                        <p className="text-center text-xs text-gray-400 mt-4">
                            🔒 Secure booking • Free cancellation up to 24 hours before
                        </p>
                    </form>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">✅</div>
                        <p className="text-xs text-gray-600">Instant Confirmation</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">🔒</div>
                        <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">🔄</div>
                        <p className="text-xs text-gray-600">Free Rescheduling</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;