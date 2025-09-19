import React from "react";

import { useState } from "react";

export default function ReportIssue() {
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Issue submitted (backend integration pending)");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        Report a Civic Issue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <div>
          <label className="block font-medium mb-1">Issue Title</label>
          <input
            type="text"
            placeholder="e.g., Pothole on Main Road"
            className="w-full border p-3 rounded"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            placeholder="Describe the issue in detail..."
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={handleFileChange}
          />
          {image && (
            <img
              src={image}
              alt="preview"
              className="mt-4 h-40 w-full object-cover rounded shadow"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            placeholder="Auto-detect coming soon"
            className="w-full border p-3 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button className="bg-green-600 text-white px-6 py-3 rounded w-full font-semibold hover:bg-green-700">
          Submit Issue
        </button>
      </form>
    </div>
  );
}
