// Login.jsx (modified)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.msg || "Login failed");
        return;
      }
      // save token & user
      saveAuth(data.token, data.user);
      setMessage("Login successful");
      // navigate based on role
      if (data.user.role === "authority") navigate("/govt-dashboard");
      else navigate("/report");
    } catch (err) {
      setMessage("Error logging in");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
      <p>Don't have an account? </p>
      <Link to="/register" className="text-blue-500 text-sm mt-2 inline-block">
        Register
      </Link>
    </div>
  );
}
