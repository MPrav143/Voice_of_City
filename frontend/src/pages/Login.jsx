import React from "react";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🔑 Login feature will be connected to backend");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border p-3 rounded"
              required
            />
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded w-full font-semibold hover:bg-green-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account? <a href="#" className="text-green-600 font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
}
