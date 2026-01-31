import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPaw, FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                <Link to="/login">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
                    Login
                  </button>
                </Link>
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

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </>
  );
}

export default Header;