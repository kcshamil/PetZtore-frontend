import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPaw, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative bg-slate-900 text-gray-300 mt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaPaw className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  PetZone
                </h2>
              </div>
            </div>
            <p className="text-sm text-purple-300 mb-6">
              Your trusted destination for pet adoption and premium pet products. Making tails wag since 2024.
            </p>
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <FaHeart className="text-pink-500" />
              <span className="text-sm">Made with love for pets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'Adopt a Pet', 'Shop Products', 'About Us', 'Contact'].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    className="text-purple-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 relative group"
                  >
                    <span className="absolute -left-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'FAQs', 'Privacy Policy', 'Terms & Conditions', 'Shipping Info'].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    className="text-purple-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 relative group"
                  >
                    <span className="absolute -left-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-3 text-purple-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-purple-400" />
                </div>
                <span>hello@petstore.com</span>
              </div>
              <div className="flex items-center gap-3 text-purple-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-purple-400" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-purple-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-purple-400" />
                </div>
                <span>123 Pet Street, CA</span>
              </div>
            </div>

            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, color: 'from-blue-600 to-blue-500', link: 'https://facebook.com' },
                { icon: <FaInstagram />, color: 'from-pink-600 to-rose-500', link: 'https://instagram.com' },
                { icon: <FaTwitter />, color: 'from-sky-600 to-blue-500', link: 'https://twitter.com' },
                { icon: <FaLinkedinIn />, color: 'from-blue-700 to-blue-600', link: 'https://linkedin.com' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

      

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-purple-300 text-center md:text-left">
              © {new Date().getFullYear()} PetZone. All rights reserved. Made with <FaHeart className="inline text-pink-500 animate-pulse" /> for pets everywhere.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Cookies</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;