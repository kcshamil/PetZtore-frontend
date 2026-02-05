import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Info, Plus, Search, Star, Check, X, Send, User, Mail, Phone, MessageSquare, Bell, Eye, FileText, Lock } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link, useNavigate } from 'react-router-dom';
import { getApprovedPetsAPI, submitAdoptionRequestAPI } from "../services/allAPI";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Pets() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Adoption form data
  const [adoptionForm, setAdoptionForm] = useState({
    adopterName: '',
    adopterEmail: '',
    adopterPhone: '',
    adopterMessage: ''
  });

  // Gradient options for pets
  const gradients = [
    "from-amber-500 via-orange-500 to-red-500",
    "from-blue-500 via-indigo-500 to-purple-500",
    "from-purple-500 via-pink-500 to-rose-500",
    "from-yellow-500 via-amber-500 to-orange-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-green-500 via-emerald-500 to-teal-500",
    "from-gray-500 via-slate-500 to-zinc-500",
    "from-pink-500 via-rose-500 to-red-500"
  ];

  // Helper function to format age
  const formatAge = (age) => {
    if (!age) return 'Not specified';
    const ageNum = parseFloat(age);
    if (ageNum < 1) {
      const months = Math.round(ageNum * 12);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'}`;
  };

  // ✅ Check if user is logged in
  const isUserLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    fetchApprovedPets();
    // Load saved email if exists
    const savedEmail = localStorage.getItem('adopterEmail');
    if (savedEmail) {
      setAdoptionForm(prev => ({ ...prev, adopterEmail: savedEmail }));
    }
  }, []);

  const fetchApprovedPets = async () => {
    try {
      setLoading(true);
      
      // ✅ Use the new public endpoint - no token required
      const response = await getApprovedPetsAPI();
      
      if (response.data.success) {
        // All registrations are already filtered to approved status
        const approvedRegistrations = response.data.data.registrations;
        
        // Transform to pet format
        const transformedPets = approvedRegistrations.map((reg, index) => ({
          id: reg._id,
          name: reg.pet.name,
          type: reg.pet.type,
          breed: reg.pet.breed,
          age: reg.pet.age, // Store raw age value
          ageValue: reg.pet.age,
          gender: reg.pet.gender,
          location: reg.pet.location,
          image: reg.pet.photos?.[0] || "https://via.placeholder.com/400",
          allPhotos: reg.pet.photos || [],
          description: reg.pet.description,
          vaccinated: reg.pet.vaccinated,
          trained: reg.pet.trained,
          license: reg.pet.license,
          ownerEmail: reg.owner.email,
          ownerPhone: reg.owner.phone,
          gradient: gradients[index % gradients.length]
        }));
        
        setPets(transformedPets);
      }
    } catch (error) {
      console.error("Error fetching approved pets:", error);
      toast.error("Failed to load pets. Please try again.");
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Dog', 'Cat', 'Bird'];

  const filteredPets = pets.filter(pet => {
    const matchesCategory = selectedCategory === 'All' || pet.type === selectedCategory;
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ✅ Handle adopt button click with login check
  const handleAdoptClick = (pet) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      setSelectedPet(pet);
      setShowLoginPrompt(true);
      return;
    }

    setSelectedPet(pet);
    setShowAdoptModal(true);
    // Keep saved email if exists, reset other fields
    const savedEmail = localStorage.getItem('adopterEmail') || '';
    setAdoptionForm({
      adopterName: '',
      adopterEmail: savedEmail,
      adopterPhone: '',
      adopterMessage: ''
    });
  };

  // Handle show details click
  const handleDetailsClick = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };

  // Handle adoption form submission
  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!adoptionForm.adopterName || !adoptionForm.adopterEmail || !adoptionForm.adopterPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adoptionForm.adopterEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(adoptionForm.adopterPhone.replace(/[\s-]/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);

    try {
      const response = await submitAdoptionRequestAPI(selectedPet.id, adoptionForm);
      
      if (response.data.success) {
        // Save email to localStorage for future use
        localStorage.setItem('adopterEmail', adoptionForm.adopterEmail);
        
        toast.success('Adoption request submitted successfully! The owner will contact you soon.');
        setShowAdoptModal(false);
        setSelectedPet(null);
        setAdoptionForm({
          adopterName: '',
          adopterEmail: '',
          adopterPhone: '',
          adopterMessage: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to submit adoption request');
      }
    } catch (error) {
      console.error("Error submitting adoption:", error);
      toast.error(error.response?.data?.message || 'Failed to submit adoption request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6 animate-gradient">
              Find Your Perfect Companion
            </h1>
            <p className="text-purple-200 text-xl max-w-2xl mx-auto">
              Browse our collection of adorable pets waiting for their forever homes. Each one approved and ready for adoption! 🐾
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg p-8 rounded-3xl border border-purple-500/20 shadow-2xl mb-12">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400" size={24} />
              <input
                type="text"
                placeholder="Search by name or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-700/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-slate-700/50 text-purple-300 hover:bg-slate-700 border-2 border-purple-500/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/petreg')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-all"></div>
              <Plus className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Add Pet for Adoption</span>
            </button>
            
            <button
              onClick={() => navigate('/adoption/request')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-all"></div>
              <Eye className="w-6 h-6 relative z-10" />
              <span className="relative z-10">View My Adoption Requests</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-purple-300 text-xl">Loading adorable pets...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredPets.length === 0 && (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-purple-500/30 mx-auto mb-4" />
              <p className="text-purple-300 text-xl">No pets found matching your criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pets Grid */}
          {!loading && filteredPets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPets.map((pet, index) => (
                <div
                  key={pet.id}
                  className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-3xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${pet.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {pet.vaccinated && (
                        <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Check size={12} /> Vaccinated
                        </span>
                      )}
                      {pet.trained && (
                        <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Star size={12} /> Trained
                        </span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className={`absolute top-4 right-4 px-4 py-2 bg-gradient-to-r ${pet.gradient} backdrop-blur-sm rounded-full text-white font-bold text-sm shadow-lg`}>
                      {pet.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-2">{pet.name}</h3>
                    <p className="text-purple-300 mb-4">{pet.breed}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-purple-200">
                        <Calendar size={16} className="text-purple-400" />
                        <span className="text-sm">{formatAge(pet.age)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-200">
                        <MapPin size={16} className="text-purple-400" />
                        <span className="text-sm">{pet.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-200">
                        <Info size={16} className="text-purple-400" />
                        <span className="text-sm capitalize">{pet.gender}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDetailsClick(pet)}
                        className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-purple-300 hover:text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-purple-500/20 hover:border-purple-500/50"
                      >
                        <Eye size={18} />
                        Details
                      </button>
                      <button
                        onClick={() => handleAdoptClick(pet)}
                        className={`flex-1 px-4 py-3 bg-gradient-to-r ${pet.gradient} text-white rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        <Heart size={18} />
                        Adopt
                      </button>
                    </div>
                  </div>

                  {/* Decorative gradient orb */}
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${pet.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-purple-500/30 animate-scale-up overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <button 
                onClick={() => {
                  setShowLoginPrompt(false);
                  setSelectedPet(null);
                }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 z-10"
              >
                <X size={20} />
              </button>

              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                  Login Required
                </h2>
                
                <p className="text-purple-200 mb-8 text-lg leading-relaxed">
                  Please log in to your account to adopt <span className="font-bold text-white">{selectedPet?.name}</span>. 
                  Don't have an account? Register now to find your perfect companion! 🐾
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-purple-300 hover:text-white rounded-xl font-bold transition-all duration-300 border-2 border-purple-500/20 hover:border-purple-500/50"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adoption Modal */}
        {showAdoptModal && selectedPet && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border-2 border-purple-500/30 animate-scale-up overflow-y-auto">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <button 
                onClick={() => {
                  setShowAdoptModal(false);
                  setSelectedPet(null);
                }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${selectedPet.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    Adopt {selectedPet.name}
                  </h2>
                  <p className="text-purple-300">Fill in your details to submit an adoption request</p>
                </div>

                <form onSubmit={handleAdoptionSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                      <User size={18} />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={adoptionForm.adopterName}
                      onChange={(e) => setAdoptionForm({ ...adoptionForm, adopterName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                      <Mail size={18} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={adoptionForm.adopterEmail}
                      onChange={(e) => setAdoptionForm({ ...adoptionForm, adopterEmail: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                      <Phone size={18} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={adoptionForm.adopterPhone}
                      onChange={(e) => setAdoptionForm({ ...adoptionForm, adopterPhone: e.target.value })}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                      <MessageSquare size={18} />
                      Message (Optional)
                    </label>
                    <textarea
                      value={adoptionForm.adopterMessage}
                      onChange={(e) => setAdoptionForm({ ...adoptionForm, adopterMessage: e.target.value })}
                      placeholder="Tell the owner why you'd like to adopt this pet..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-purple-200 text-sm leading-relaxed">
                          Your request will be sent to the pet owner. They will review your information and contact you directly if approved. Make sure your contact details are correct!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full px-8 py-4 bg-gradient-to-r ${selectedPet.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Adoption Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Pet Details Modal - keeping it as it was but with updated adopt button */}
        {showDetailsModal && selectedPet && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full my-8 shadow-2xl border-2 border-purple-500/30 animate-scale-up">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPet(null);
                }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 max-h-[85vh] overflow-y-auto scrollbar-hide">
                <div className="space-y-8">
                  {/* Header with Image */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative rounded-2xl overflow-hidden h-80 md:h-auto">
                      <img
                        src={selectedPet.image}
                        alt={selectedPet.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${selectedPet.gradient} opacity-20`} />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                        {selectedPet.name}
                      </h2>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-purple-200 text-lg">
                          <span className={`px-4 py-2 bg-gradient-to-r ${selectedPet.gradient} rounded-full text-white font-bold text-sm`}>
                            {selectedPet.type}
                          </span>
                          <span className="text-white font-semibold">{selectedPet.breed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <Calendar size={20} className="text-purple-400" />
                          <span className="font-semibold">{formatAge(selectedPet.age)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <MapPin size={20} className="text-purple-400" />
                          <span className="font-semibold">{selectedPet.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <Info size={20} className="text-purple-400" />
                          <span className="font-semibold capitalize">{selectedPet.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                      About {selectedPet.name}
                    </h4>
                    <p className="text-purple-200 leading-relaxed bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border-2 border-purple-500/20">
                      {selectedPet.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Health & Training Info */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      Health & Training Status
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Vaccination Status */}
                      {selectedPet.vaccinated ? (
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                          <div className="w-14 h-14 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-400/50">
                            <Check className="w-7 h-7 text-green-300" />
                          </div>
                          <div>
                            <p className="text-green-300 font-bold text-lg mb-1">✅ Vaccinated</p>
                            <p className="text-green-200/80 text-sm">Up-to-date on all vaccinations</p>
                            <p className="text-green-300/60 text-xs mt-1">Health records available</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl p-5 flex items-start gap-4">
                          <div className="w-14 h-14 bg-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-yellow-400/50">
                            <X className="w-7 h-7 text-yellow-300" />
                          </div>
                          <div>
                            <p className="text-yellow-300 font-bold text-lg mb-1">Not Vaccinated</p>
                            <p className="text-yellow-200/80 text-sm">May need vaccinations</p>
                            <p className="text-yellow-300/60 text-xs mt-1">Discuss with owner</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Training Status */}
                      {selectedPet.trained ? (
                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                          <div className="w-14 h-14 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-blue-400/50">
                            <Star className="w-7 h-7 text-blue-300 fill-blue-300" />
                          </div>
                          <div>
                            <p className="text-blue-300 font-bold text-lg mb-1">⭐ Trained</p>
                            <p className="text-blue-200/80 text-sm">Well-behaved and obedient</p>
                            <p className="text-blue-300/60 text-xs mt-1">Great for families</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-5 flex items-start gap-4">
                          <div className="w-14 h-14 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-purple-400/50">
                            <X className="w-7 h-7 text-purple-300" />
                          </div>
                          <div>
                            <p className="text-purple-300 font-bold text-lg mb-1">Not Trained</p>
                            <p className="text-purple-200/80 text-sm">May need training</p>
                            <p className="text-purple-300/60 text-xs mt-1">Discuss with owner</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owner Contact Information */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-pink-400" />
                      Owner Contact Information
                    </h4>
                    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border-2 border-purple-500/20 space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-400 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-purple-300 text-sm font-semibold mb-1">Email Address</p>
                          <p className="text-white font-bold text-lg break-all">{selectedPet.ownerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-400 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-purple-300 text-sm font-semibold mb-1">Phone Number</p>
                          <p className="text-white font-bold text-lg">{selectedPet.ownerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pet License Document */}
                  {selectedPet.license && (
                    <div>
                      <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-yellow-400" />
                        Pet License Document
                      </h4>
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 border-2 border-yellow-500/30 hover:border-yellow-400 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-yellow-300 font-bold text-lg mb-2">✅ License Verified</p>
                            <p className="text-yellow-200/80 text-sm mb-3">
                              This pet has a valid license document on file, verified by our admin team.
                            </p>
                            {selectedPet.license.startsWith('data:image') ? (
                              <div className="mt-4">
                                <img
                                  src={selectedPet.license}
                                  alt="Pet License"
                                  className="w-full max-h-96 object-contain rounded-lg border-2 border-yellow-500/30"
                                />
                              </div>
                            ) : selectedPet.license.startsWith('data:application/pdf') ? (
                              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                <FileText className="w-6 h-6 text-yellow-400" />
                                <div>
                                  <p className="text-white font-semibold">PDF License Document</p>
                                  <p className="text-yellow-300/60 text-sm">License file is available (PDF format)</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                                <Check className="w-6 h-6 text-green-400" />
                                <p className="text-green-300 text-sm">License document verified and on file</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration Note */}
                  <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Info className="w-4 h-4 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm font-semibold mb-2">📋 Registration Information</p>
                        <p className="text-purple-300 text-sm leading-relaxed">
                          All information displayed above is from the verified pet registration submitted by the owner and approved by our admin team. The registration includes pet details, health status, training information, and owner contact details. Click "Adopt {selectedPet.name}" below to submit your adoption request!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Adopt Button */}
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAdoptClick(selectedPet);
                    }}
                    className={`w-full px-8 py-5 bg-gradient-to-r ${selectedPet.gradient} text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3`}
                  >
                    <Heart className="w-6 h-6" />
                    Adopt {selectedPet.name} Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-up {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in { 
            animation: fade-in 0.6s ease-out forwards; 
            opacity: 0; 
          }
          .animate-scale-up {
            animation: scale-up 0.4s ease-out;
          }
          .animate-gradient { 
            background-size: 200% 200%; 
            animation: gradient 3s ease infinite; 
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-spin { animation: spin 1s linear infinite; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
   
  );
}

export default Pets;