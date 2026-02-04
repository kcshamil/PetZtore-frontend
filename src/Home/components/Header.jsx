import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPaw, FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    setToken(null);
    navigate('/login');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pets", path: "/pets" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo & App Name */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <FaPaw className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  PetZone
                </h1>
                <p className="text-xs text-purple-300">Find your companion</p>
              </div>
            </Link>

            {/* Center: Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  {isActive(link.path) && (
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full" />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right: Login/Logout Button & Mobile Menu */}
            <div className="flex items-center gap-4">
              {!token ? (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full font-bold hover:shadow-xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 animate-slide-down">
              <nav className="flex flex-col gap-2 bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive(link.path)
                        ? "text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                        : "text-purple-300 hover:text-white hover:bg-purple-500/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ✅ LOGIN MODAL - Choose User Type */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 rounded-3xl max-w-2xl w-full border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-800/90 backdrop-blur-lg px-8 py-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Choose Login Type
                  </h2>
                  <p className="text-purple-300 text-sm mt-1">Select how you want to login</p>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="w-10 h-10 bg-red-500/20 border-2 border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - 2 Options */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Option 1: Regular User Login */}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/login');
                  }}
                  className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-blue-500/50 transform group-hover:rotate-6 transition-all duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 text-center">
                      Regular User
                    </h3>
                    
                    {/* Description */}
                    <p className="text-blue-200 text-sm text-center mb-4">
                      Browse pets, shop products, and adopt your perfect companion
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-blue-300">
                        <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>Browse available pets</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-300">
                        <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>Shop pet products</span>
                      </li>
                      <li className="flex items-center gap-2 text-blue-300">
                        <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>Submit adoption requests</span>
                      </li>
                    </ul>

                    {/* Arrow */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                        <span className="text-blue-400 text-xl">→</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Option 2: Pet Owner Login */}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/owner/login');
                  }}
                  className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-purple-500/50 transform group-hover:rotate-6 transition-all duration-300">
                      <FaPaw className="text-white text-3xl" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 text-center">
                      Pet Owner
                    </h3>
                    
                    {/* Description */}
                    <p className="text-purple-200 text-sm text-center mb-4">
                      Manage your pet registration and adoption requests
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-purple-300">
                        <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>Edit pet information</span>
                      </li>
                      <li className="flex items-center gap-2 text-purple-300">
                        <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>View adoption requests</span>
                      </li>
                      <li className="flex items-center gap-2 text-purple-300">
                        <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                        <span>Approve/reject adopters</span>
                      </li>
                    </ul>

                    {/* Arrow */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                        <span className="text-purple-400 text-xl">→</span>
                      </div>
                    </div>
                  </div>
                </button>

              </div>

              {/* Bottom Note */}
              <div className="mt-6 text-center">
                <p className="text-purple-300 text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate('/pet-registration');
                    }}
                    className="text-pink-400 hover:text-pink-300 font-semibold hover:underline"
                  >
                    Register your pet here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </>
  );
}

export default Header;