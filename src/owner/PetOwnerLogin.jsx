import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, PawPrint, ArrowLeft } from 'lucide-react';
import { loginOwnerAPI } from "../services/allAPI";
import { toast, ToastContainer } from 'react-toastify';
import Header from '../Home/components/Header';
import Footer from '../Home/components/Footer';

function PetOwnerLogin() {
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    
    if (!email || !password) {
      toast.info('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await loginOwnerAPI(loginData);
      console.log(result);
      
      if (result.status === 200) {
        toast.success('Login successful!');
        // Store token in sessionStorage
        sessionStorage.setItem('petOwnerToken', result.data.token);
        sessionStorage.setItem('petOwner', JSON.stringify(result.data.registration));
        
        setTimeout(() => {
          navigate('/owner/profile');
        }, 1500);
      } else if (result.status === 401 || result.status === 404 || result.status === 403 || result.status === 423) {
        toast.error(result.response?.data?.message || 'Login failed');
        setLoginData({ email: '', password: '' });
      } else {
        toast.error('Something went wrong!');
        setLoginData({ email: '', password: '' });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      setLoginData({ email: '', password: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 py-12 px-4 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="bg-slate-800/80 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transform transition-all duration-500 border-2 border-purple-500/30">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8 mt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Pet Owner Login
            </h1>
            <p className="text-purple-200 text-sm">
              Access your pet owner dashboard
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-200 text-sm">
              <strong>Note:</strong> This login is specifically for pet owners who have registered their pets for adoption. If you're a regular user, please use the <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">main login page</button>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-pink-400 transition-colors" />
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 text-white transition-all duration-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-pink-400 transition-colors" />
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Password *"
                className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 text-white transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setViewPassword(!viewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-pink-400 transition-colors"
              >
                {viewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                loading ? 'opacity-70 cursor-not-allowed scale-100' : ''
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Login to Dashboard
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Don't have a pet registered yet?{' '}
              <button 
                onClick={() => navigate('/pet-registration')}
                className="text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text font-semibold hover:underline"
              >
                Register Your Pet
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-purple-500/30"></div>
            <span className="text-purple-300 text-sm">OR</span>
            <div className="flex-1 h-px bg-purple-500/30"></div>
          </div>

          {/* Regular User Login Link */}
          <div className="text-center">
            <p className="text-purple-200 text-sm mb-2">
              Are you a regular user looking to adopt?
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-2 bg-slate-700/50 border-2 border-purple-500/30 text-purple-300 rounded-xl hover:bg-slate-700 hover:border-purple-400 transition-all duration-300"
            >
              Go to User Login
            </button>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 0.15;
              transform: scale(1.05);
            }
          }
        `}</style>
      </section>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />
    </>
  );
}

export default PetOwnerLogin;