import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Info, Plus, Search, Star, Check, X, Send, User, Mail, Phone, MessageSquare, Bell, Eye, FileText } from 'lucide-react';
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

  // Handle adopt button click
  const handleAdoptClick = (pet) => {
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
          adopterEmail: adoptionForm.adopterEmail, // Keep email
          adopterPhone: '',
          adopterMessage: ''
        });
        
        // Refresh the pets list to update adoption status
        fetchApprovedPets();
      }
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit adoption request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Close modals
  const closeModals = () => {
    setShowAdoptModal(false);
    setShowDetailsModal(false);
    setSelectedPet(null);
  };

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
  
        {/* Hero Section */}
        <div className="relative pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-6">
                <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                  🐾 Find Your Perfect Companion
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4 animate-gradient">
                Adopt a Pet Today
              </h1>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Give a loving home to pets in need. Browse our available companions waiting for their forever family.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => navigate('/adoption/request')}
                  className="px-6 py-3 bg-purple-500/20 border-2 border-purple-500/30 text-purple-300 rounded-xl font-bold hover:bg-purple-500/30 transition-all flex items-center gap-2 justify-center"
                >
                  <Bell className="w-5 h-5" />
                  View My Adoption Requests
                </button>
                
                <button 
                  onClick={() => navigate('/petreg')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add Pet for Adoption
                </button>
              </div>
            </div>
  
            {/* Search and Filter Bar */}
            <div className="bg-slate-800/50 backdrop-blur-lg border-2 border-purple-500/30 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or breed..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50 transition-all"
                  />
                </div>
  
                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-slate-700/50 text-purple-300 border-2 border-purple-500/30 hover:bg-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mb-4" />
                <p className="text-purple-300 text-lg">Loading adorable pets...</p>
              </div>
            ) : (
              <>
                {/* Pet Cards Grid */}
                {filteredPets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                    {filteredPets.map((pet, index) => (
                      <div
                        key={pet.id}
                        className="group bg-slate-800/50 backdrop-blur-lg border-2 border-purple-500/30 rounded-3xl overflow-hidden hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Pet Image */}
                        <div className="relative overflow-hidden h-64">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${pet.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                          
                          {/* Quick Info Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            {pet.vaccinated && (
                              <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Vaccinated
                              </span>
                            )}
                            {pet.trained && (
                              <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" /> Trained
                              </span>
                            )}
                          </div>
                        </div>
  
                        {/* Pet Info */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                                {pet.name}
                              </h3>
                              <p className="text-purple-300 font-semibold">{pet.breed}</p>
                            </div>
                            <Heart className="w-6 h-6 text-pink-400 group-hover:fill-pink-400 transition-all" />
                          </div>
  
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-purple-200">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{formatAge(pet.age)}</span>
                              <span className="text-purple-500">•</span>
                              <span className="text-sm capitalize">{pet.gender}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-200">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{pet.location}</span>
                            </div>
                          </div>
  
                          <p className="text-purple-200/80 text-sm mb-4 line-clamp-2">
                            {pet.description}
                          </p>
  
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDetailsClick(pet)}
                              className="flex-1 px-4 py-2 bg-slate-700/50 border-2 border-purple-500/30 text-purple-300 rounded-xl hover:bg-slate-700 transition-all font-bold flex items-center justify-center gap-2"
                            >
                              <Info className="w-4 h-4" />
                              Details
                            </button>
                            <button
                              onClick={() => handleAdoptClick(pet)}
                              className={`flex-1 px-4 py-2 bg-gradient-to-r ${pet.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                            >
                              <Heart className="w-4 h-4" />
                              Adopt
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No pets found</h3>
                    <p className="text-purple-200">
                      {searchQuery || selectedCategory !== 'All'
                        ? 'Try adjusting your search or filter'
                        : 'Check back soon for new pets!'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Adoption Request Modal */}
        {showAdoptModal && selectedPet && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800/95 backdrop-blur-lg border-2 border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-slate-800/95 backdrop-blur-lg border-b border-purple-500/30 p-6 flex justify-between items-center">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Adopt {selectedPet.name}
                </h2>
                <button
                  onClick={closeModals}
                  className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form onSubmit={handleAdoptionSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adoptionForm.adopterName}
                      onChange={(e) => setAdoptionForm({...adoptionForm, adopterName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={adoptionForm.adopterEmail}
                      onChange={(e) => setAdoptionForm({...adoptionForm, adopterEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={adoptionForm.adopterPhone}
                      onChange={(e) => setAdoptionForm({...adoptionForm, adopterPhone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50"
                      placeholder="Your contact number"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-purple-200 mb-2 font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message to Owner (Optional)
                    </label>
                    <textarea
                      value={adoptionForm.adopterMessage}
                      onChange={(e) => setAdoptionForm({...adoptionForm, adopterMessage: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-purple-300/50 resize-none"
                      placeholder="Tell the owner why you'd like to adopt this pet..."
                      rows="4"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-purple-200 text-sm">
                      <strong>Note:</strong> Your request will be sent to the pet owner. They will review your request and contact you if approved. You can track your request status by clicking "View My Adoption Requests" on the main page.
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="flex-1 px-6 py-3 bg-slate-700/50 border-2 border-purple-500/30 text-purple-300 rounded-xl font-bold hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedPet.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Pet Details Modal */}
        {showDetailsModal && selectedPet && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800/95 backdrop-blur-lg border-2 border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-slate-800/95 backdrop-blur-lg border-b border-purple-500/30 p-6 flex justify-between items-center">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Pet Details
                </h2>
                <button
                  onClick={closeModals}
                  className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Pet Name & Type Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
                    {selectedPet.name}
                  </h3>
                  <p className="text-purple-300 text-xl font-semibold">{selectedPet.breed} • {selectedPet.type}</p>
                </div>

                {/* Image Gallery */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Pet Photos {selectedPet.allPhotos.length > 0 && `(${selectedPet.allPhotos.length})`}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPet.allPhotos.length > 0 ? (
                      selectedPet.allPhotos.map((photo, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-2xl">
                          <img
                            src={photo}
                            alt={`${selectedPet.name} - Photo ${index + 1}`}
                            className="w-full h-64 object-cover border-2 border-purple-500/30 group-hover:border-purple-400 transition-all group-hover:scale-105 duration-300"
                          />
                          <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur-sm rounded-lg text-purple-200 text-xs font-bold border border-purple-500/30">
                            Photo {index + 1} of {selectedPet.allPhotos.length}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2">
                        <img
                          src={selectedPet.image}
                          alt={selectedPet.name}
                          className="w-full h-96 object-cover rounded-2xl border-2 border-purple-500/30"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Pet Registration Information */}
                <div className="space-y-6">
                  
                  {/* Basic Information Section */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-cyan-400" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-purple-500/20 hover:border-purple-400 transition-all">
                        <p className="text-purple-300 text-sm mb-1 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          Pet Type
                        </p>
                        <p className="text-white font-bold text-xl">{selectedPet.type}</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-purple-500/20 hover:border-purple-400 transition-all">
                        <p className="text-purple-300 text-sm mb-1 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          Breed
                        </p>
                        <p className="text-white font-bold text-xl">{selectedPet.breed}</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-purple-500/20 hover:border-purple-400 transition-all">
                        <p className="text-purple-300 text-sm mb-1 font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Age
                        </p>
                        <p className="text-white font-bold text-xl">{formatAge(selectedPet.age)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-purple-500/20 hover:border-purple-400 transition-all">
                        <p className="text-purple-300 text-sm mb-1 font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Gender
                        </p>
                        <p className="text-white font-bold text-xl capitalize">{selectedPet.gender}</p>
                      </div>
                      <div className="md:col-span-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-purple-500/20 hover:border-purple-400 transition-all">
                        <p className="text-purple-300 text-sm mb-1 font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="text-white font-bold text-xl">{selectedPet.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      About {selectedPet.name}
                    </h4>
                    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 border-2 border-purple-500/20">
                      <p className="text-white leading-relaxed text-lg">{selectedPet.description}</p>
                    </div>
                  </div>

                  {/* Health & Training Status */}
                  <div>
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-4">
                      Health & Training Status
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vaccination Status */}
                      {selectedPet.vaccinated ? (
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                          <div className="w-14 h-14 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-400/50">
                            <Check className="w-7 h-7 text-green-300" />
                          </div>
                          <div>
                            <p className="text-green-300 font-bold text-lg mb-1">✅ Vaccinated</p>
                            <p className="text-green-200/80 text-sm">All vaccinations are up to date</p>
                            <p className="text-green-300/60 text-xs mt-1">Ready for adoption</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50 rounded-xl p-5 flex items-start gap-4">
                          <div className="w-14 h-14 bg-orange-500/30 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-400/50">
                            <X className="w-7 h-7 text-orange-300" />
                          </div>
                          <div>
                            <p className="text-orange-300 font-bold text-lg mb-1">Not Vaccinated</p>
                            <p className="text-orange-200/80 text-sm">May require vaccinations</p>
                            <p className="text-orange-300/60 text-xs mt-1">Consult with owner</p>
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
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in { 
            animation: fade-in 0.6s ease-out forwards; 
            opacity: 0; 
          }
          .animate-gradient { 
            background-size: 200% 200%; 
            animation: gradient 3s ease infinite; 
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
      </div>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
   
  );
}

export default Pets;