import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Report", path: "/report" },
    { name: "Issues", path: "/issues" },
    { name: "Rewards", path: "/rewards" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="font-extrabold text-xl tracking-wide">
        Voice of City
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
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

      {/* Hamburger Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-green-700 flex flex-col items-start px-6 py-4 space-y-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`w-full hover:text-gray-200 ${
                pathname === link.path ? "underline font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
