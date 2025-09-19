import React from "react";

import { useState } from "react";

const mockIssues = [
  { id: 1, title: "Pothole on Main Street", status: "In Progress" },
  { id: 2, title: "Garbage not collected", status: "Reported" },
  { id: 3, title: "Streetlight not working", status: "Solved" },
];

export default function Issues() {
  const [filter, setFilter] = useState("All");

  const filteredIssues =
    filter === "All"
      ? mockIssues
      : mockIssues.filter((issue) => issue.status === filter);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Reported Issues</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {["All", "Reported", "In Progress", "Solved"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Issue Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="p-6 border rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold">{issue.title}</h3>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                issue.status === "Solved"
                  ? "bg-green-200 text-green-800"
                  : issue.status === "In Progress"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {issue.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
