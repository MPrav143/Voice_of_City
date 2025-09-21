import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("user"); // "user" or "authority"
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registered successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "❌ Registration failed");
      }
    } catch (err) {
      setMessage("⚠️ Error connecting to server");
    }
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
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <textarea
                name="address"
                placeholder="Enter your address"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              ></textarea>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <input
                name="name"
                type="text"
                placeholder="Enter authority name"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Enter authority email"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="jurisdiction"
                type="text"
                placeholder="Taluk / Corporation / Municipality"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <textarea
                name="jurisdictionAddress"
                placeholder="Address of Taluk / Corporation / Municipality"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              ></textarea>
              <input
                name="position"
                type="text"
                placeholder="e.g. Head of Sanitation Dept"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full border p-3 rounded"
                onChange={handleChange}
                required
              />
            </>
          )}

          <button className="bg-green-600 text-white px-6 py-3 rounded w-full font-semibold hover:bg-green-700">
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}

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
