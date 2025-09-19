import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function Register() {
  const [role, setRole] = useState("user"); // "user" or "authority"

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`📝 Register feature for ${role} will be connected to backend`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Register
        </h2>

        {/* Role Switch */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded font-semibold ${
              role === "user"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Citizen User
          </button>
          <button
            type="button"
            onClick={() => setRole("authority")}
            className={`px-4 py-2 rounded font-semibold ${
              role === "authority"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Govt Authority
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {role === "user" ? (
            <>
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone No</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Address</label>
                <textarea
                  placeholder="Enter your address"
                  className="w-full border p-3 rounded"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-medium mb-1">Email ID</label>
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
                  placeholder="Enter password"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter authority name"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email ID</label>
                <input
                  type="email"
                  placeholder="Enter authority email"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Taluk / Corporation / Municipality
                </label>
                <input
                  type="text"
                  placeholder="Enter jurisdiction"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Address of Taluk / Corporation / Municipality
                </label>
                <textarea
                  placeholder="Enter address"
                  className="w-full border p-3 rounded"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Position / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Sanitation Dept"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>
            </>
          )}

          <button className="bg-green-600 text-white px-6 py-3 rounded w-full font-semibold hover:bg-green-700">
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
                Login
            </Link>
        </p>
      </div>
    </div>
  );
}
