import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  const navbarLinks = [{ name: "Admin Dashboard", path: "/admin" }];
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = "http://localhost:5000/api/users";

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setStats({ totalUsers: res.data.length });
      } else {
        setUsers([]);
        setStats({ totalUsers: 0 });
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setError("Failed to load users");
      setUsers([]);
      setStats({ totalUsers: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete user");
    }
  };

  // ================= UPDATE ROLE =================
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API}/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.log("Update error:", err);
      alert("Failed to update role");
    }
  };

  return (
    <DashboardLayout navbarLinks={navbarLinks}>
      <div className="min-h-screen bg-gray-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">
            👑 Admin Dashboard
          </h1>
          <div className="text-gray-600">
            Logged in as:{" "}
            <span className="font-semibold">{user?.email || "Unknown"}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-gray-500 text-sm">Total Users</h2>
            <p className="text-2xl font-bold mt-2">
              {loading ? "..." : stats.totalUsers}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-gray-500 text-sm">Active Sessions</h2>
            <p className="text-2xl font-bold mt-2">34</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-gray-500 text-sm">System Status</h2>
            <p className="text-2xl font-bold mt-2 text-green-600">
              Running
            </p>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            User Management
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id} className="border-b">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>

                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;