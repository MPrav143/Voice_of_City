// GovtDashboard.jsx
import React, { useEffect, useState } from "react";
import { getToken, getUser } from "./utils/auth";
import { socket } from "./socket";

export default function GovtDashboard() {
  const [issues, setIssues] = useState([]);
  const user = getUser();

  useEffect(() => {
    fetchIssues();
    socket.on("new_report", (p) => {
      // optionally filter by dept/jurisdiction
      setIssues(prev => [p, ...prev]);
    });
    socket.on("update_report", (p) => {
      setIssues(prev => prev.map(i => (String(i._id || i.id) === String(p.id) ? {...i, ...p} : i)));
    });
    return () => {
      socket.off("new_report"); socket.off("update_report");
    };
  }, []);

  async function fetchIssues() {
    const token = getToken();
    const res = await fetch("http://localhost:5000/api/govt/issues", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (d.success) setIssues(d.issues);
  }

  async function updateStatus(id, status, file=null) {
    const token = getToken();
    const form = new FormData();
    form.append("status", status);
    if (file) form.append("solvedImage", file);

    const res = await fetch(`http://localhost:5000/api/reports/${id}/status`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    const d = await res.json();
    if (d.success) {
      // updated via socket too
      alert("Updated");
    } else {
      alert("Failed to update");
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Govt Dashboard</h2>
      <div className="grid gap-4">
        {issues.map(issue => (
          <div key={issue._id} className="p-4 border rounded">
            <h3 className="font-semibold">{issue.englishDescription || issue.originalDescription}</h3>
            <p className="text-sm text-gray-600">Status: {issue.status}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={()=> updateStatus(issue._id, "In Progress")} className="px-3 py-1 bg-yellow-500 text-white rounded">Mark In Progress</button>
              <label className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer">
                Mark Solved + Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={(e)=> updateStatus(issue._id, "Solved", e.target.files[0])} />
              </label>
            </div>
            {issue.imageUrl && <img src={issue.imageUrl} alt="" className="mt-2 h-32 w-full object-cover rounded" />}
          </div>
        ))}
      </div>
    </div>
  );
}
