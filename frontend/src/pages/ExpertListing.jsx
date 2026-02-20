import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Star, Clock, Briefcase, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpertListing = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { id: 'technology', name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-600' },
        { id: 'management', name: 'Management', icon: '📊', color: 'bg-purple-100 text-purple-600' },
        { id: 'marketing', name: 'Marketing', icon: '📈', color: 'bg-green-100 text-green-600' },
        { id: 'finance', name: 'Finance', icon: '💰', color: 'bg-emerald-100 text-emerald-600' },
        { id: 'design', name: 'Design', icon: '🎨', color: 'bg-pink-100 text-pink-600' },
        { id: 'consulting', name: 'Consulting', icon: '🤝', color: 'bg-orange-100 text-orange-600' },
    ];

const fetchExperts = async () => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    try {
        const res = await axios.get(`${API_URL}/experts?page=${page}&search=${search}&category=${category}`);
        setExperts(res.data.experts);
        setTotalPages(res.data.totalPages);
    } catch (err) {
        console.error("Error fetching experts", err);
    }
    setLoading(false);
};

    useEffect(() => { fetchExperts(); }, [page, category]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchExperts();
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setPage(1);
        fetchExperts();
    };

    const getCategoryDetails = (catName) => {
        return categories.find(c => c.name.toLowerCase() === catName?.toLowerCase()) || 
               { icon: '🔧', color: 'bg-gray-100 text-gray-600' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Find an Expert</h1>
                            <p className="text-gray-600 mt-1">Book sessions with industry professionals</p>
                        </div>
                        <Link 
                            to="/my-bookings" 
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                        >
                            <Briefcase size={18} />
                            My Bookings
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="Search experts by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition ${
                                    showFilters || category 
                                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Filter size={18} />
                                <span className="hidden sm:inline">Filters</span>
                                {category && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{1}</span>}
                            </button>
                            
                            {(search || category) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                                >
                                    <X size={18} />
                                    <span className="hidden sm:inline">Clear</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Category</p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setCategory(category === cat.name ? '' : cat.name);
                                            setPage(1);
                                        }}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                                            category === cat.name
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {experts.length} experts
                        </div>

                        {/* Experts Grid */}
                        {experts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {experts.map(expert => {
                                    const categoryDetail = getCategoryDetails(expert.category);
                                    return (
                                        <div 
                                            key={expert._id} 
                                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                                        >
                                            {/* Card Header with Category Color */}
                                            <div className={`h-2 ${categoryDetail.color.split(' ')[0]}`}></div>
                                            
                                            <div className="p-6">
                                                {/* Category Badge */}
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryDetail.color} mb-3`}>
                                                    <span>{categoryDetail.icon}</span>
                                                    <span>{expert.category}</span>
                                                </div>

                                                {/* Expert Info */}
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                                                    {expert.name}
                                                </h3>
                                                
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock size={16} />
                                                        <span className="text-sm">{expert.experience} Years Experience</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Star size={16} className="text-yellow-400 fill-current" />
                                                        <span className="text-sm font-medium">
                                                            {expert.rating} <span className="text-gray-500">/ 5.0</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* CTA Button */}
                                                <Link 
                                                    to={`/expert/${expert._id}`}
                                                    className="mt-4 w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 group/btn"
                                                >
                                                    <span>View Available Slots</span>
                                                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && experts.length > 0 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Show current page, first, last, and pages around current
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    Math.abs(pageNum - page) <= 1
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg transition ${
                                                page === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    pageNum === page - 2 ||
                                    pageNum === page + 2
                                ) {
                                    return <span key={i} className="w-10 h-10 flex items-center justify-center">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertListing;