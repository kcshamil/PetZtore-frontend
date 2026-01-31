import React from "react";
import { FaPaw, FaHeart, FaUsers, FaShieldAlt, FaStar, FaHandHoldingHeart, FaAward, FaGlobe } from "react-icons/fa";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";

function About() {
    return (
        <>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
                </div>

                {/* Hero Section */}
                <section className="relative pt-20 pb-24 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-block mb-6 animate-fade-in">
                            <span className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
                                🐾 About PetStore
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in" style={{animationDelay: '0.1s'}}>
                            <span className="text-white">Where Every Pet</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 animate-gradient">
                                Finds Their Forever Home
                            </span>
                        </h1>
                        <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto mb-12 animate-fade-in" style={{animationDelay: '0.2s'}}>
                            Your trusted platform for pet adoption, registration, and quality pet products.
                            We are passionate about connecting pets with loving homes.
                        </p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                            {[
                                { number: "10K+", label: "Pets Adopted", gradient: "from-orange-500 to-red-500" },
                                { number: "50K+", label: "Happy Families", gradient: "from-purple-500 to-pink-500" },
                                { number: "100+", label: "Partner Shelters", gradient: "from-cyan-500 to-blue-500" }
                            ].map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="group relative bg-slate-800/50 backdrop-blur-lg rounded-2xl px-8 py-6 border border-purple-500/20 transform hover:scale-110 transition-all duration-500 cursor-pointer"
                                >
                                    <p className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1`}>
                                        {stat.number}
                                    </p>
                                    <p className="text-purple-300 text-sm font-semibold">{stat.label}</p>
                                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-full blur-3xl`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission / Vision / Values */}
                <section className="relative max-w-7xl mx-auto px-6 pb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4 animate-fade-in">
                            Our Core Values
                        </h2>
                        <p className="text-purple-300 text-lg max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
                            Everything we do is guided by our commitment to pets and their families
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: <FaHeart size={32} />, 
                                title: "Our Mission", 
                                desc: "To provide a safe and loving environment for pets, helping them find their forever homes through compassionate care and dedicated support.",
                                gradient: "from-red-500 to-pink-500",
                                delay: '0s'
                            },
                            { 
                                icon: <FaGlobe size={32} />, 
                                title: "Our Vision", 
                                desc: "To be the leading online platform for pet adoption and pet care products worldwide, creating a global community of pet lovers.",
                                gradient: "from-blue-500 to-cyan-500",
                                delay: '0.1s'
                            },
                            { 
                                icon: <FaPaw size={32} />, 
                                title: "Our Values", 
                                desc: "Compassion, transparency, and dedication to the wellbeing of pets and their owners in everything we do.",
                                gradient: "from-emerald-500 to-teal-500",
                                delay: '0.2s'
                            }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer animate-fade-in"
                                style={{animationDelay: item.delay}}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                    <div className="text-white">{item.icon}</div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-purple-300 leading-relaxed">{item.desc}</p>
                                <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-3xl`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="relative max-w-7xl mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative animate-fade-in" style={{animationDelay: '0.2s'}}>
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl" />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="https://recoverywarriors.com/wp-content/uploads/2014/11/life-lessons-pets.jpg"
                                    alt="Pets"
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <p className="text-3xl font-black">4.9★</p>
                                <p className="text-sm font-semibold">Rating</p>
                            </div>
                        </div>
                        
                        <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                <span className="text-white">Why Choose </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PetZone?</span>
                            </h2>
                            <p className="text-purple-300 text-lg mb-8">
                                We go above and beyond to ensure the best experience for both pets and their future families.
                            </p>
                            
                            <div className="space-y-4">
                                {[
                                    { icon: <FaShieldAlt />, text: "Trusted platform for pet adoption and care", gradient: "from-blue-500 to-cyan-500" },
                                    { icon: <FaStar />, text: "High-quality products for all types of pets", gradient: "from-yellow-500 to-orange-500" },
                                    { icon: <FaHandHoldingHeart />, text: "Easy-to-use registration and adoption process", gradient: "from-pink-500 to-red-500" },
                                    { icon: <FaUsers />, text: "Expert advice and support for pet owners", gradient: "from-purple-500 to-indigo-500" },
                                    { icon: <FaHeart />, text: "Dedicated team passionate about animal welfare", gradient: "from-emerald-500 to-teal-500" },
                                ].map((item, idx) => (
                                    <div key={idx} className="group flex items-start gap-4 p-4 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                            {item.icon}
                                        </div>
                                        <p className="text-purple-200 font-medium pt-2">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="relative max-w-7xl mx-auto px-6 pb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-fade-in">
                            Meet Our Team
                        </h2>
                        <p className="text-purple-300 text-lg max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
                            Passionate professionals dedicated to animal welfare
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Johnson", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/women/44.jpg", gradient: "from-purple-500 to-pink-500", delay: '0s' },
                            { name: "Mike Davis", role: "Head of Operations", image: "https://randomuser.me/api/portraits/men/32.jpg", gradient: "from-cyan-500 to-blue-500", delay: '0.1s' },
                            { name: "Emily Chen", role: "Veterinary Director", image: "https://randomuser.me/api/portraits/women/68.jpg", gradient: "from-orange-500 to-red-500", delay: '0.2s' }
                        ].map((member, idx) => (
                            <div 
                                key={idx} 
                                className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer animate-fade-in overflow-hidden"
                                style={{animationDelay: member.delay}}
                            >
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-20 rounded-2xl blur-xl`} />
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="relative w-32 h-32 rounded-2xl mx-auto mb-4 object-cover transform group-hover:scale-110 transition-transform duration-500 border-4 border-purple-500/30"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-1">{member.name}</h3>
                                <p className={`text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r ${member.gradient}`}>
                                    {member.role}
                                </p>
                                <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${member.gradient} opacity-20 rounded-full blur-3xl`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Achievements Section */}
                <section className="relative max-w-7xl mx-auto px-6 pb-20">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-12">
                                Our Achievements
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                {[
                                    { icon: <FaAward />, title: "Best Pet Platform 2025", gradient: "from-yellow-500 to-orange-500" },
                                    { icon: <FaHeart />, title: "10,000+ Successful Adoptions", gradient: "from-red-500 to-pink-500" },
                                    { icon: <FaStar />, title: "5-Star Customer Rating", gradient: "from-purple-500 to-indigo-500" },
                                    { icon: <FaUsers />, title: "50,000+ Community Members", gradient: "from-cyan-500 to-blue-500" }
                                ].map((achievement, idx) => (
                                    <div key={idx} className="text-center group">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${achievement.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                            <div className="text-white text-3xl">{achievement.icon}</div>
                                        </div>
                                        <h3 className="text-white font-bold text-lg">{achievement.title}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative max-w-6xl mx-auto px-6 pb-20">
                    <div className="text-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
                        <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Join Our Pet Community Today
                            </h2>
                            <p className="text-purple-200 text-lg mb-10 max-w-2xl mx-auto">
                                Adopt, shop, or register your pet today and be part of our loving pet family.
                                Together, we can make a difference in the lives of countless animals.
                            </p>
                           <Link to={'/'}>
                                <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
                                    Get Started Now
                                </button>
                           </Link>
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

            <Footer />
        </>
    );
}

export default About;