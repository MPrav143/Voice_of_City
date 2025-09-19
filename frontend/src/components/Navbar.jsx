import React from "react";

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Report", path: "/report" },
    { name: "Issues", path: "/issues" },
    { name: "Rewards", path: "/rewards" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link to="/" className="font-extrabold text-xl tracking-wide">
        Voice of City
      </Link>
      <div className="flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`hover:text-gray-200 ${
              pathname === link.path ? "underline font-semibold" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
