import React, { useEffect, useState } from "react";
import { getToken, getUser } from "../utils/auth";
import { socket } from "../socket";

export default function GovtDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchIssues();

    // Real-time updates
    socket.on("new_report", (report) => {
      setIssues((prev) => [report, ...prev]);
    });

    socket.on("update_report", (updatedReport) => {
      setIssues((prev) =>
        prev.map((i) =>
          String(i._id || i.id) === String(updatedReport._id || updatedReport.id)
            ? { ...i, ...updatedReport }
            : i
        )
      );
    });

    return () => {
      socket.off("new_report");
      socket.off("update_report");
    };
  }, []);

  // Fetch issues from backend
  async function fetchIssues() {
    const token = getToken();
    if (!token) {
      setError("You must be logged in to view issues.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/govt/issues`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      // Check for authentication issues
      if (res.status === 401) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }
      
      if (res.status === 403) {
        setError("Forbidden. You don't have permission to access this resource.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Fetched issues:", data);

      if (data.success) {
        // Map imagePath to full URL for rendering
        const mappedIssues = data.issues.map((issue) => ({
          ...issue,
          imageUrl: issue.imagePath ? `${API_URL}/${issue.imagePath}` : null,
          solvedImageUrl: issue.solvedImagePath ? `${API_URL}/${issue.solvedImagePath}` : null,
        }));
        setIssues(mappedIssues);
        setError("");
      } else {
        setError(data.error || "Failed to fetch issues");
        setIssues([]);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("Failed to fetch issues. Check your connection.");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }

  // Update issue status
  async function updateStatus(id, status, file = null) {
    const token = getToken();
    if (!token) {
      alert("❌ You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("status", status);
    if (file) formData.append("solvedImage", file);

    try {
      const res = await fetch(`${API_URL}/api/reports/${id}/status`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const data = await res.json();

      if (data.success) {
        alert("✅ Updated successfully");
        // Update locally
        setIssues((prev) =>
          prev.map((i) => 
            String(i._id) === String(id) 
              ? { 
                  ...i, 
                  status,
                  solvedImagePath: data.solvedImagePath || i.solvedImagePath,
                  solvedImageUrl: data.solvedImagePath ? `${API_URL}/${data.solvedImagePath}` : i.solvedImageUrl
                } 
              : i
          )
        );
      } else {
        alert(data.error || "❌ Failed to update");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Error updating status");
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Government Dashboard</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Government Dashboard</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={fetchIssues} 
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Welcome, {user?.name || user?.email}. {issues.length > 0 ? `Showing ${issues.length} reports` : ''}
        </p>
        <button 
          onClick={fetchIssues}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {error ? 'No reports could be loaded.' : 'No reports yet. Reports will appear here as they are submitted.'}
        </div>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold mb-1 text-lg">
                    {issue.originalDescription || "No description"}
                  </h3>
                  
                  {issue.englishDescription && issue.originalDescription && (
                    <p className="text-sm text-gray-500 mb-2">
                      Translation: {issue.englishDescription}
                    </p>
                  )}
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Department: {issue.assignedDept || "Not assigned"}</p>
                    <p>Status: 
                      <span className={
                        issue.status === "Solved" ? "text-green-600 font-medium" : 
                        issue.status === "In Progress" ? "text-yellow-600 font-medium" : 
                        "text-red-600 font-medium"
                      }> {issue.status}</span>
                    </p>
                    <p>Reported on: {new Date(issue.timestamp).toLocaleString()}</p>
                    {issue.user && (
                      <p>Reported by: {issue.user.name || issue.user.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {issue.status !== "In Progress" && (
                    <button
                      onClick={() => updateStatus(issue._id, "In Progress")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Mark In Progress
                    </button>
                  )}
                  
                  {issue.status !== "Solved" && (
                    <label className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700">
                      Mark Solved + Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          updateStatus(issue._id, "Solved", e.target.files[0])
                        }
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                {issue.imageUrl && (
                  <div>
                    <p className="text-sm font-medium mb-1">Report Image:</p>
                    <img
                      src={issue.imageUrl}
                      alt="issue"
                      className="h-48 w-full object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                {issue.solvedImageUrl && (
                  <div>
                    <p className="text-sm font-medium mb-1">Solved Image:</p>
                    <img
                      src={issue.solvedImageUrl}
                      alt="solved issue"
                      className="h-48 w-full object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}