import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Mail, Phone, MessageSquare, Calendar, 
  CheckCircle, XCircle, Clock, PawPrint, ArrowLeft,
  Bell, AlertCircle, RefreshCw,
  User
} from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getUserAdoptionRequestsAPI } from "../services/allAPI";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdoptionRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get user email from localStorage or session
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Try to get email from localStorage/sessionStorage
    const savedEmail = localStorage.getItem('adopterEmail') || sessionStorage.getItem('adopterEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      fetchUserRequests(savedEmail);
    } else {
      // Prompt user to enter email
      const email = prompt('Please enter your email to view your adoption requests:');
      if (email) {
        setUserEmail(email);
        localStorage.setItem('adopterEmail', email);
        fetchUserRequests(email);
      } else {
        toast.error('Email is required to view requests');
        navigate('/pets');
      }
    }
  }, [navigate]);

  const fetchUserRequests = async (email) => {
    try {
      setLoading(true);
      const response = await getUserAdoptionRequestsAPI(email);
      
      if (response.data.success) {
        setRequests(response.data.data.adoptions);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load your adoption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserRequests(userEmail);
    setRefreshing(false);
    toast.success('Requests refreshed!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending Review',
          className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Approved',
          className: 'text-green-400 bg-green-500/20 border-green-500/30'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Not Approved',
          className: 'text-red-400 bg-red-500/20 border-red-500/30'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: status,
          className: 'text-gray-400 bg-gray-500/20 border-gray-500/30'
        };
    }
  };

  const RequestCard = ({ request }) => {
    const statusBadge = getStatusBadge(request.adoptionStatus);
    
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-[1.02]">
        {/* Header with Pet Name and Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              {request.petName}
            </h3>
            <p className="text-purple-200 text-sm">
              Request ID: {request._id.slice(-8)}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-xl border-2 font-semibold flex items-center gap-2 ${statusBadge.className}`}>
            {statusBadge.icon}
            {statusBadge.text}
          </span>
        </div>

        {/* Request Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 text-purple-200">
            <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-300">Your Name</p>
              <p className="font-semibold text-white">{request.adopterName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-purple-200">
            <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-300">Email</p>
              <p className="font-semibold text-white">{request.adopterEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-purple-200">
            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-300">Phone</p>
              <p className="font-semibold text-white">{request.adopterPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-purple-200">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-300">Submitted On</p>
              <p className="font-semibold text-white">
                {new Date(request.adoptionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {request.adopterMessage && (
            <div className="flex items-start gap-3 text-purple-200">
              <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-purple-300 mb-1">Your Message</p>
                <p className="text-white bg-slate-700/50 rounded-lg p-3 border border-purple-500/20">
                  {request.adopterMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status-specific messages */}
        {request.adoptionStatus === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold mb-1">Under Review</p>
              <p className="text-yellow-200/80 text-sm">
                The pet owner is reviewing your request. They will contact you soon!
              </p>
            </div>
          </div>
        )}

        {request.adoptionStatus === 'approved' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-semibold mb-1"> Congratulations!</p>
              <p className="text-green-200/80 text-sm">
                Your adoption request has been approved! The pet owner will contact you at {request.adopterPhone} or {request.adopterEmail} to arrange the next steps.
              </p>
            </div>
          </div>
        )}

        {request.adoptionStatus === 'rejected' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold mb-1">Request Not Approved</p>
              <p className="text-red-200/80 text-sm">
                Unfortunately, your request was not approved at this time. Don't give up! There are many other wonderful pets waiting for a loving home.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filter requests by status
  const pendingRequests = requests.filter(r => r.adoptionStatus === 'pending');
  const approvedRequests = requests.filter(r => r.adoptionStatus === 'approved');
  const rejectedRequests = requests.filter(r => r.adoptionStatus === 'rejected');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/pets')}
                className="mb-4 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Pets
              </button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    My Adoption Requests
                  </h1>
                  <p className="text-purple-200 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Track the status of your adoption applications
                  </p>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-6 py-3 bg-purple-500/20 border-2 border-purple-500/30 text-purple-300 rounded-xl font-bold hover:bg-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mb-4" />
                <p className="text-purple-300">Loading your requests...</p>
              </div>
            ) : (
              <>
                {/* No Requests */}
                {requests.length === 0 ? (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-12 text-center">
                    <PawPrint className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Requests Yet</h3>
                    <p className="text-purple-200 mb-6">
                      You haven't submitted any adoption requests yet.
                    </p>
                    <button
                      onClick={() => navigate('/pets')}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                    >
                      Browse Available Pets
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Approved Requests */}
                    {approvedRequests.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          Approved Requests ({approvedRequests.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {approvedRequests.map(request => (
                            <RequestCard key={request._id} request={request} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Requests */}
                    {pendingRequests.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                          <Clock className="w-6 h-6" />
                          Pending Requests ({pendingRequests.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {pendingRequests.map(request => (
                            <RequestCard key={request._id} request={request} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejected Requests */}
                    {rejectedRequests.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
                          <XCircle className="w-6 h-6" />
                          Not Approved ({rejectedRequests.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {rejectedRequests.map(request => (
                            <RequestCard key={request._id} request={request} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default AdoptionRequests;