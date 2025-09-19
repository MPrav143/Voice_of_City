import React from "react";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white text-center py-20 px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Voice of City</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Report civic issues, track updates, and earn rewards for contributing to a better community.
        </p>
        <div className="space-x-4">
          <Link
            to="/report"
            className="bg-white text-green-700 px-6 py-3 rounded shadow hover:bg-gray-100"
          >
            Report an Issue
          </Link>
          <Link
            to="/issues"
            className="bg-yellow-400 text-black px-6 py-3 rounded shadow hover:bg-yellow-300"
          >
            View Issues
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">📸 Snap & Tag</h3>
            <p>Upload a photo with location details to report an issue instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">📍 Track Progress</h3>
            <p>Stay updated as your issue moves from Reported → In Progress → Solved.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🏆 Earn Rewards</h3>
            <p>Get credit points for your contributions, redeemable for government services.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
