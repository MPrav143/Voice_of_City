import React from "react";

export default function Rewards() {
  const points = 120; // mock value

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Your Rewards</h2>

      <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
        <p className="text-lg mb-3">You have earned:</p>
        <span className="text-5xl font-extrabold text-green-600">
          {points} pts 🎉
        </span>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-3">How to Use Rewards</h3>
        <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>Redeem for government service discounts</li>
          <li>Use for utility bill payments</li>
          <li>Exchange for community benefits</li>
        </ul>
      </div>
    </div>
  );
}
