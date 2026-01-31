import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <section className="relative pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                💬 Get In Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
                Contact Us
              </span>
            </h1>
            <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              We'd love to hear from you! Whether it's questions, feedback, or adoption inquiries, reach out to us.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="relative max-w-7xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <FaPhone size={28} />, title: "Phone", info: "+1 234 567 890", gradient: "from-orange-500 to-red-500", delay: '0s' },
              { icon: <FaEnvelope size={28} />, title: "Email", info: "support@petstore.com", gradient: "from-purple-500 to-pink-500", delay: '0.1s' },
              { icon: <FaMapMarkerAlt size={28} />, title: "Address", info: "123 Pet Street, Pet City", gradient: "from-cyan-500 to-blue-500", delay: '0.2s' },
              { icon: <FaClock size={28} />, title: "Hours", info: "Mon-Fri: 9AM - 6PM", gradient: "from-green-500 to-emerald-500", delay: '0.3s' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                style={{animationDelay: item.delay}}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-purple-300 text-sm">{item.info}</p>
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-3xl`} />
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="relative animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="bg-slate-800/50 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-2xl border border-purple-500/20 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white mb-6">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle size={40} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-purple-300">We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          required
                          className="w-full bg-slate-700/50 border-2 border-purple-500/30 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 placeholder-purple-300/50"
                        />
                      </div>
                      
                      <div className="group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your Email"
                          required
                          className="w-full bg-slate-700/50 border-2 border-purple-500/30 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 placeholder-purple-300/50"
                        />
                      </div>
                      
                      <div className="group">
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          required
                          className="w-full bg-slate-700/50 border-2 border-purple-500/30 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 placeholder-purple-300/50"
                        />
                      </div>
                      
                      <div className="group">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your Message"
                          rows={6}
                          required
                          className="w-full bg-slate-700/50 border-2 border-purple-500/30 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 placeholder-purple-300/50 resize-none"
                        ></textarea>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Image & Info Section */}
            <div className="space-y-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://pethavenmn.org/wp-content/uploads/2016/04/dog_phone.jpg"
                  alt="Pets"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-black mb-2">We're Here to Help!</h3>
                  <p className="text-purple-200">Our friendly team is ready to assist you with any questions.</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                    Why Contact Us?
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Adoption inquiries and guidance",
                      "Pet care advice from experts",
                      "Product recommendations",
                      "Partnership opportunities",
                      "General questions and support"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-purple-200">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaCheckCircle size={12} className="text-white" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map/CTA Section */}
        <section className="relative max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Visit Our Store
              </h2>
              <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
                Come meet our team and the adorable pets waiting for their forever homes!
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
                Get Directions
              </button>
            </div>
          </div>
        </section>

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
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        `}</style>
      </div>
      
      <Footer/>
    </>
  );
}

export default Contact;