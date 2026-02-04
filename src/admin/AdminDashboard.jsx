import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, LogOut, PawPrint, Clock, CheckCircle, XCircle, 
  Eye, Search, AlertCircle, TrendingUp, Users,
  Calendar, Mail, Phone, MapPin, Trash2, UserCheck,
  Heart, Package, Image as ImageIcon, FileText
} from 'lucide-react';
import { getAllRegistrationsAPI, updateRegistrationStatusAPI } from "../services/allAPI";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    adopted: 0,
    owners: 0
  });

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken && savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      setToken(savedToken);
      setAdmin(user);
      fetchRegistrations(savedToken);
    } else {
      toast.warning('Please login as admin');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const fetchRegistrations = async (authToken) => {
    setLoading(true);
    try {
      const response = await getAllRegistrationsAPI(authToken);
      if (response.status === 200) {
        const regs = response.data.registrations || [];
        setRegistrations(regs);
        setStats({
          total: regs.length,
          pending: regs.filter(r => r.status === 'pending').length,
          approved: regs.filter(r => r.status === 'approved').length,
          rejected: regs.filter(r => r.status === 'rejected').length,
          adopted: regs.filter(r => r.pet.adoptionStatus === 'adopted').length,
          owners: new Set(regs.map(r => r.owner.email)).size
        });
      }
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    if (!window.confirm(`${newStatus} this registration?`)) return;
    setUpdatingStatus(true);
    try {
      const response = await updateRegistrationStatusAPI(registrationId, { status: newStatus }, token);
      if (response.status === 200) {
        toast.success(`Registration ${newStatus}!`);
        await fetchRegistrations(token);
        setShowDetailsModal(false);
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteRegistration = async (registrationId, petName) => {
    if (!window.confirm(`Delete "${petName}"? This will permanently remove this pet from all pages.`)) return;
    setDeletingId(registrationId);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/delete-registration/${registrationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Pet "${petName}" deleted!`);
        await fetchRegistrations(token);
        setShowDetailsModal(false);
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete registration');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    toast.success('Logged out');
    setTimeout(() => navigate('/login'), 1500);
  };

  const getPetOwners = () => {
    const ownersMap = new Map();
    registrations.forEach(reg => {
      if (!ownersMap.has(reg.owner.email)) {
        ownersMap.set(reg.owner.email, {
          email: reg.owner.email,
          phone: reg.owner.phone,
          pets: [],
          registeredAt: reg.createdAt
        });
      }
      ownersMap.get(reg.owner.email).pets.push({
        name: reg.pet.name,
        breed: reg.pet.breed,
        status: reg.status,
        adoptionStatus: reg.pet.adoptionStatus
      });
    });
    return Array.from(ownersMap.values());
  };

  const getAdoptedPets = () => registrations.filter(r => r.pet.adoptionStatus === 'adopted');

  const filteredRegistrations = registrations.filter(reg => {
    const matchesFilter = selectedFilter === 'all' || reg.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      reg.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatAge = (age) => {
    if (!age) return 'Not specified';
    const ageNum = parseFloat(age);
    if (ageNum < 1) {
      const months = Math.round(ageNum * 12);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${ageNum} ${ageNum === 1 ? 'year' : 'years'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Admin Dashboard</h1>
                  <p className="text-purple-200">Welcome, {admin?.username}!</p>
                </div>
              </div>
              <button onClick={handleLogout} className="px-6 py-3 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2 font-bold">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-blue-500/30 p-6">
              <Package className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              <p className="text-blue-200 text-sm">Total</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-yellow-500/30 p-6">
              <Clock className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.pending}</h3>
              <p className="text-yellow-200 text-sm">Pending</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-green-500/30 p-6">
              <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.approved}</h3>
              <p className="text-green-200 text-sm">Approved</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-red-500/30 p-6">
              <XCircle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.rejected}</h3>
              <p className="text-red-200 text-sm">Rejected</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-pink-500/30 p-6">
              <Heart className="w-8 h-8 text-pink-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.adopted}</h3>
              <p className="text-pink-200 text-sm">Adopted</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/30 p-6">
              <UserCheck className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats.owners}</h3>
              <p className="text-cyan-200 text-sm">Owners</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border-2 border-purple-500/30">
            <button onClick={() => setActiveTab('registrations')} className={`flex-1 min-w-[180px] px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'registrations' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'}`}>
              <PawPrint className="w-5 h-5" />
              Pet Registrations
            </button>
            <button onClick={() => setActiveTab('owners')} className={`flex-1 min-w-[180px] px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'owners' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'}`}>
              <UserCheck className="w-5 h-5" />
              Pet Owners ({stats.owners})
            </button>
            <button onClick={() => setActiveTab('adopted')} className={`flex-1 min-w-[180px] px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'adopted' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'}`}>
              <Heart className="w-5 h-5" />
              Adopted ({stats.adopted})
            </button>
          </div>

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(filter => (
                      <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-6 py-3 rounded-xl font-bold transition-all capitalize ${selectedFilter === filter ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'}`}>
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <PawPrint className="w-6 h-6 text-purple-400" />
                  Pet Registrations ({filteredRegistrations.length})
                </h2>

                {filteredRegistrations.length === 0 ? (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-16 text-center">
                    <AlertCircle className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No registrations found</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRegistrations.map(reg => (
                      <div key={reg._id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 overflow-hidden hover:border-purple-400 transition-all">
                        {/* Pet Image */}
                        {reg.pet.photos && reg.pet.photos.length > 0 ? (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={reg.pet.photos[0]}
                              alt={reg.pet.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <span className={`px-4 py-2 rounded-xl border-2 text-sm font-bold capitalize backdrop-blur-sm ${
                                reg.status === 'pending' ? 'text-yellow-400 bg-yellow-500/80 border-yellow-500' :
                                reg.status === 'approved' ? 'text-green-400 bg-green-500/80 border-green-500' :
                                'text-red-400 bg-red-500/80 border-red-500'
                              }`}>
                                {reg.status}
                              </span>
                            </div>
                            {reg.pet.adoptionStatus === 'adopted' && (
                              <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 rounded-xl border-2 text-sm font-bold backdrop-blur-sm bg-pink-500/80 border-pink-500 text-white flex items-center gap-2">
                                  <Heart className="w-4 h-4" />
                                  Adopted
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-64 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                            <PawPrint className="w-24 h-24 text-purple-400/50" />
                            <div className="absolute top-4 right-4">
                              <span className={`px-4 py-2 rounded-xl border-2 text-sm font-bold capitalize backdrop-blur-sm ${
                                reg.status === 'pending' ? 'text-yellow-400 bg-yellow-500/80 border-yellow-500' :
                                reg.status === 'approved' ? 'text-green-400 bg-green-500/80 border-green-500' :
                                'text-red-400 bg-red-500/80 border-red-500'
                              }`}>
                                {reg.status}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Pet Details */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                              <PawPrint className="w-6 h-6 text-purple-400" />
                              {reg.pet.name}
                            </h3>
                            <p className="text-purple-300 text-lg">{reg.pet.breed}</p>
                          </div>

                          {/* Pet Information Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-purple-300 text-xs mb-1">Type</p>
                              <p className="text-white font-semibold">{reg.pet.type}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-purple-300 text-xs mb-1">Age</p>
                              <p className="text-white font-semibold">{formatAge(reg.pet.age)}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-purple-300 text-xs mb-1">Gender</p>
                              <p className="text-white font-semibold">{reg.pet.gender}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-purple-300 text-xs mb-1">Vaccinated</p>
                              <p className="text-white font-semibold">{reg.pet.vaccinated ? 'Yes' : 'No'}</p>
                            </div>
                          </div>

                          {/* Location and Owner */}
                          <div className="space-y-2 mb-4 text-sm">
                            <p className="flex items-center gap-2 text-purple-200">
                              <MapPin className="w-4 h-4 text-purple-400" />
                              <span className="font-semibold">Location:</span> {reg.pet.location}
                            </p>
                            <p className="flex items-center gap-2 text-purple-200">
                              <Mail className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold">Owner:</span> {reg.owner.email}
                            </p>
                            <p className="flex items-center gap-2 text-purple-200">
                              <Phone className="w-4 h-4 text-green-400" />
                              <span className="font-semibold">Phone:</span> {reg.owner.phone}
                            </p>
                            <p className="flex items-center gap-2 text-purple-200">
                              <Calendar className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold">Registered:</span> {new Date(reg.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Description Preview */}
                          <div className="mb-4">
                            <p className="text-purple-300 text-sm line-clamp-2">
                              {reg.pet.description}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button onClick={() => { setSelectedRegistration(reg); setShowDetailsModal(true); }} className="flex-1 px-4 py-2 bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2 font-bold">
                              <Eye className="w-4 h-4" />
                              View Full Details
                            </button>
                            {reg.status === 'pending' && (
                              <>
                                <button onClick={() => handleStatusUpdate(reg._id, 'approved')} disabled={updatingStatus} className="px-4 py-2 bg-green-500/20 border-2 border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2 font-bold">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleStatusUpdate(reg._id, 'rejected')} disabled={updatingStatus} className="px-4 py-2 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2 font-bold">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDeleteRegistration(reg._id, reg.pet.name)} disabled={deletingId === reg._id} className="px-4 py-2 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 font-bold">
                              {deletingId === reg._id ? <div className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Owners Tab */}
          {activeTab === 'owners' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-purple-400" />
                Pet Owners ({getPetOwners().length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getPetOwners().map((owner, i) => (
                  <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Owner Details</h3>
                        <div className="space-y-2 text-purple-200">
                          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" />{owner.email}</p>
                          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" />{owner.phone}</p>
                          <p className="flex items-center gap-2"><Calendar className="w-4 h-4" />Registered: {new Date(owner.registeredAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t-2 border-purple-500/30 pt-4">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-purple-400" />
                        Pets ({owner.pets.length})
                      </h4>
                      <div className="space-y-2">
                        {owner.pets.map((pet, j) => (
                          <div key={j} className="bg-slate-700/50 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold">{pet.name}</p>
                              <p className="text-purple-200 text-sm">{pet.breed}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${pet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : pet.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {pet.status}
                              </span>
                              {pet.adoptionStatus === 'adopted' && <span className="px-3 py-1 rounded-lg text-xs font-bold bg-pink-500/20 text-pink-400">Adopted</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adopted Tab */}
          {activeTab === 'adopted' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-400" />
                Adopted Pets ({getAdoptedPets().length})
              </h2>
              {getAdoptedPets().length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-16 text-center">
                  <Heart className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No adopted pets yet</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getAdoptedPets().map(reg => {
                    const approvedAdoption = reg.adoptions.find(a => a.adoptionStatus === 'approved');
                    return (
                      <div key={reg._id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-pink-500/30 p-6">
                        {reg.pet.photos?.[0] && (
                          <img src={reg.pet.photos[0]} alt={reg.pet.name} className="w-full h-48 object-cover rounded-xl border-2 border-purple-500/30 mb-4" />
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">{reg.pet.name}</h3>
                            <p className="text-sm text-purple-200">Breed: {reg.pet.breed}</p>
                            <p className="text-sm text-purple-200">Age: {formatAge(reg.pet.age)}</p>
                          </div>
                          <span className="px-4 py-2 rounded-xl border-2 text-sm font-bold bg-pink-500/20 border-pink-500/30 text-pink-400">Adopted</span>
                        </div>
                        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                          <h4 className="text-white font-bold mb-2">Previous Owner</h4>
                          <p className="text-sm text-purple-200"><Mail className="w-3 h-3 inline" /> {reg.owner.email}</p>
                          <p className="text-sm text-purple-200"><Phone className="w-3 h-3 inline" /> {reg.owner.phone}</p>
                        </div>
                        {approvedAdoption && (
                          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4">
                            <h4 className="text-green-400 font-bold mb-2">New Owner</h4>
                            <p className="text-sm text-green-200">Name: {approvedAdoption.adopterName}</p>
                            <p className="text-sm text-green-200"><Mail className="w-3 h-3 inline" /> {approvedAdoption.adopterEmail}</p>
                            <p className="text-sm text-green-200"><Phone className="w-3 h-3 inline" /> {approvedAdoption.adopterPhone}</p>
                            <p className="text-sm text-green-200"><Calendar className="w-3 h-3 inline" /> {new Date(approvedAdoption.adoptionDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl border-2 border-purple-500/30 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b-2 border-purple-500/30 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Complete Pet Registration Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all">
                  <XCircle className="w-6 h-6 text-purple-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Registration Status Banner */}
                <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                  selectedRegistration.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  selectedRegistration.status === 'approved' ? 'bg-green-500/10 border-green-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    {selectedRegistration.status === 'pending' && <Clock className="w-6 h-6 text-yellow-400" />}
                    {selectedRegistration.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {selectedRegistration.status === 'rejected' && <XCircle className="w-6 h-6 text-red-400" />}
                    <div>
                      <p className={`font-bold text-lg ${
                        selectedRegistration.status === 'pending' ? 'text-yellow-400' :
                        selectedRegistration.status === 'approved' ? 'text-green-400' :
                        'text-red-400'
                      }`}>
                        Registration Status: {selectedRegistration.status.toUpperCase()}
                      </p>
                      <p className="text-purple-200 text-sm">
                        Registered on: {new Date(selectedRegistration.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {selectedRegistration.pet.adoptionStatus === 'adopted' && (
                    <span className="px-4 py-2 rounded-xl bg-pink-500/20 border-2 border-pink-500/30 text-pink-400 font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Adopted
                    </span>
                  )}
                </div>

                {/* Pet Photos Gallery */}
                {selectedRegistration.pet.photos?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-purple-400" />
                      Pet Photos ({selectedRegistration.pet.photos.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedRegistration.pet.photos.map((photo, i) => (
                        <div key={i} className="relative group">
                          <img 
                            src={photo} 
                            alt={`${selectedRegistration.pet.name} ${i + 1}`} 
                            className="w-full h-48 object-cover rounded-xl border-2 border-purple-500/30 group-hover:border-purple-400 transition-all"
                          />
                          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs">
                            Photo {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pet Information - Detailed */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <PawPrint className="w-6 h-6 text-purple-400" />
                    Pet Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Pet Name</p>
                      <p className="text-white text-xl font-bold">{selectedRegistration.pet.name}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Pet Type</p>
                      <p className="text-white text-xl font-bold">{selectedRegistration.pet.type}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Breed</p>
                      <p className="text-white text-xl font-bold">{selectedRegistration.pet.breed}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Age</p>
                      <p className="text-white text-xl font-bold">{formatAge(selectedRegistration.pet.age)}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Gender</p>
                      <p className="text-white text-xl font-bold">{selectedRegistration.pet.gender}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Location</p>
                      <p className="text-white text-xl font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-400" />
                        {selectedRegistration.pet.location}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Vaccinated</p>
                      <p className="text-white text-xl font-bold flex items-center gap-2">
                        {selectedRegistration.pet.vaccinated ? (
                          <><CheckCircle className="w-5 h-5 text-green-400" /> Yes</>
                        ) : (
                          <><XCircle className="w-5 h-5 text-red-400" /> No</>
                        )}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                      <p className="text-purple-300 text-sm mb-1">Trained</p>
                      <p className="text-white text-xl font-bold flex items-center gap-2">
                        {selectedRegistration.pet.trained ? (
                          <><CheckCircle className="w-5 h-5 text-green-400" /> Yes</>
                        ) : (
                          <><XCircle className="w-5 h-5 text-red-400" /> No</>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20">
                    <p className="text-purple-300 text-sm mb-2">Description</p>
                    <p className="text-white leading-relaxed">{selectedRegistration.pet.description}</p>
                  </div>

                  {/* Pet License Document */}
                  {selectedRegistration.pet.license && (
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-yellow-400" />
                        Pet License Document
                      </h3>
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 border-2 border-yellow-500/30 hover:border-yellow-400 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-yellow-300 font-bold text-lg mb-2">✅ License Document</p>
                            <p className="text-yellow-200/80 text-sm mb-3">
                              This pet has a license document on file submitted by the owner.
                            </p>
                            {selectedRegistration.pet.license.startsWith('data:image') ? (
                              <div className="mt-4">
                                <img
                                  src={selectedRegistration.pet.license}
                                  alt="Pet License"
                                  className="w-full max-h-96 object-contain rounded-lg border-2 border-yellow-500/30 bg-slate-900/50"
                                />
                              </div>
                            ) : selectedRegistration.pet.license.startsWith('data:application/pdf') ? (
                              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                <FileText className="w-6 h-6 text-yellow-400" />
                                <div>
                                  <p className="text-white font-semibold">PDF License Document</p>
                                  <p className="text-yellow-300/60 text-sm">License file is available (PDF format)</p>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-800/50 rounded-lg border border-yellow-500/20">
                                <p className="text-yellow-300 text-sm font-semibold mb-2">License Data:</p>
                                <p className="text-white font-mono text-xs break-all">{selectedRegistration.pet.license}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Owner Information */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-cyan-400" />
                    Owner Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-cyan-500/20">
                      <p className="text-cyan-300 text-sm mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </p>
                      <p className="text-white text-lg font-semibold">{selectedRegistration.owner.email}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-cyan-500/20">
                      <p className="text-cyan-300 text-sm mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </p>
                      <p className="text-white text-lg font-semibold">{selectedRegistration.owner.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Adoption Requests (if any) */}
                {selectedRegistration.adoptions && selectedRegistration.adoptions.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-pink-400" />
                      Adoption Requests ({selectedRegistration.adoptions.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedRegistration.adoptions.map((adoption, idx) => (
                        <div key={idx} className={`rounded-xl p-4 border-2 ${
                          adoption.adoptionStatus === 'approved' ? 'bg-green-500/10 border-green-500/30' :
                          adoption.adoptionStatus === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
                          'bg-yellow-500/10 border-yellow-500/30'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-white font-bold text-lg">{adoption.adopterName}</p>
                              <p className="text-purple-200 text-sm">Requested: {new Date(adoption.adoptionDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              adoption.adoptionStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                              adoption.adoptionStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {adoption.adoptionStatus}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-purple-200">📧 {adoption.adopterEmail}</p>
                            <p className="text-purple-200">📱 {adoption.adopterPhone}</p>
                          </div>
                          {adoption.adopterMessage && (
                            <p className="mt-2 text-purple-200 text-sm italic">"{adoption.adopterMessage}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Metadata */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                    Registration Timeline
                  </h3>
                  <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/20 space-y-2 text-purple-200">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Created:</span> 
                      {new Date(selectedRegistration.createdAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Last Updated:</span> 
                      {new Date(selectedRegistration.updatedAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Registration ID:</span> 
                      <code className="bg-slate-800 px-2 py-1 rounded text-xs">{selectedRegistration._id}</code>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t-2 border-purple-500/30">
                  {selectedRegistration.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedRegistration._id, 'approved')} 
                        disabled={updatingStatus}
                        className="flex-1 px-6 py-4 bg-green-500/20 border-2 border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50"
                      >
                        <CheckCircle className="w-6 h-6" />
                        Approve Registration
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedRegistration._id, 'rejected')} 
                        disabled={updatingStatus}
                        className="flex-1 px-6 py-4 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50"
                      >
                        <XCircle className="w-6 h-6" />
                        Reject Registration
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDeleteRegistration(selectedRegistration._id, selectedRegistration.pet.name)} 
                    disabled={deletingId === selectedRegistration._id} 
                    className="px-6 py-4 bg-red-500/20 border-2 border-red-500 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50"
                  >
                    {deletingId === selectedRegistration._id ? (
                      <>
                        <div className="w-6 h-6 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-6 h-6" />
                        Delete Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default AdminDashboard;