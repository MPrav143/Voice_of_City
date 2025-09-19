import React from "react";

const mockIssues = [
  { id: 1, title: "Pothole on Main Street", status: "In Progress" },
  { id: 2, title: "Garbage not collected", status: "Reported" },
  { id: 3, title: "Streetlight not working", status: "Solved" },
];

export default function Issues() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Reported Issues</h2>
      <ul className="space-y-3">
        {mockIssues.map((issue) => (
          <li key={issue.id} className="p-4 border rounded shadow flex justify-between">
            <span>{issue.title}</span>
            <span
              className={`px-2 py-1 rounded text-sm 
              ${issue.status === "Solved" ? "bg-green-200 text-green-800" :
                issue.status === "In Progress" ? "bg-yellow-200 text-yellow-800" :
                "bg-red-200 text-red-800"}`}
            >
              {issue.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
