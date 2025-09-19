import React from "react";
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 p-4 text-center">
      <p>© {new Date().getFullYear()} Voice of City — Smart India Hackathon</p>
    </footer>
  );
}
