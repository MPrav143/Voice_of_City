import React from "react";

import { useState } from "react";

export default function ReportIssue() {
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Issue submitted (backend will handle later)");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Issue title"
          className="w-full border p-2 rounded"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <textarea
          placeholder="Describe the issue"
          className="w-full border p-2 rounded"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location (auto-detect later)"
          className="w-full border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
