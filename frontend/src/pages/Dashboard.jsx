import React from "react";

export default function Dashboard() {
  // Mock stats
  const stats = [
    { title: "Total Issues Reported", value: 32, color: "bg-blue-100 text-blue-700" },
    { title: "Pending Issues", value: 10, color: "bg-red-100 text-red-700" },
    { title: "In Progress", value: 12, color: "bg-yellow-100 text-yellow-700" },
    { title: "Solved Issues", value: 10, color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg shadow-lg ${s.color} text-center font-semibold`}
          >
            <h3 className="text-lg">{s.title}</h3>
            <p className="text-3xl mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Issues Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Recent Issues</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Issue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Garbage not collected</td>
              <td className="p-3">
                <span className="bg-red-200 text-red-700 px-3 py-1 rounded">Reported</span>
              </td>
              <td className="p-3">Sep 15, 2025</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Pothole on Main Road</td>
              <td className="p-3">
                <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded">In Progress</span>
              </td>
              <td className="p-3">Sep 14, 2025</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Streetlight not working</td>
              <td className="p-3">
                <span className="bg-green-200 text-green-700 px-3 py-1 rounded">Solved</span>
              </td>
              <td className="p-3">Sep 10, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
