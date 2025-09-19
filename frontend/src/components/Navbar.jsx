import React from "react";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow">
      <Link to="/" className="font-bold text-xl">Voice of City</Link>
      <div className="space-x-4">
        <Link to="/report">Report</Link>
        <Link to="/issues">Issues</Link>
        <Link to="/rewards">Rewards</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
