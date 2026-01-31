import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-emerald-500 mb-6">404</h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved. But don’t worry – our pets are still waiting for you!
      </p>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrL_fBwVuDIln-andD7p2dt9Y_ijCupZQT9A&s"
        alt="Cute pet"
        className="w-64 h-64 object-cover rounded-xl mb-8 shadow-lg"
      />
      <button
        onClick={() => navigate("/")}
        className="bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 transition"
      >
        Go Back Home
      </button>
    </section>
  );
}

export default NotFoundPage;
