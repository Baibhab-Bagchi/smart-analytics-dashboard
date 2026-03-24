import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navbarLinks = [{ name: "Settings", path: "/settings" }];
  const { user, logout } = useAuth();
  const navigate = useNavigate();

const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem("darkMode") === "true";
  setDarkMode(saved);

  if (saved) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, []);

  const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);

  if (newMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("darkMode", newMode);
};
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
//for deleting account 
const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure?")) return;
  setLoading(true);

  try {
    const res = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error((await res.json()).message || "Failed to delete account");

    logout();
    navigate("/login");
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleChangePassword = async () => {
    const newPassword = prompt("Enter new password (min 5 chars):");
    if (!newPassword || newPassword.length < 5)
      return alert("Password too short");

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!res.ok) throw new Error("Failed to change password");
      alert("Password changed successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navbarLinks={navbarLinks}>
      <div className="min-h-[84vh] bg-gray-100 dark:bg-gray-900 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Settings
        </h1>

        <div className="grid gap-8 max-w-4xl">
          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
              Preferences
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Enable Dark Mode
              </span>
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
              Security
            </h2>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-black dark:hover:bg-gray-600 transition"
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-8">
            
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
            >
              {loading ? "Processing..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;