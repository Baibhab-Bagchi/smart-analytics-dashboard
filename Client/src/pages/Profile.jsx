import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import avatar from "../pages/avatar.jpg";
const Profile = () => {
  const navbarLinks = [{ name: "Profile", path: "/profile" }];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setName(data.user.name);
        setEmail(data.user.email);
      } catch (err) {
        console.error(err);
        alert("Error fetching profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found, please login again");

    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.user.name, email: data.user.email })
      );
   // Optional: small delay for smooth feel
    await new Promise((resolve) => setTimeout(resolve, 700));

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
     finally {
  setSaving(false);
}
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <DashboardLayout navbarLinks={navbarLinks}>
      <div className="p-6 flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-6">
          <img
          src={avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-600"
          />
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            />
         <button
  onClick={handleSave}
  disabled={saving}
  className={`px-6 py-2 rounded-lg text-white transition
    ${saving ? "bg-gray-700 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-950"}`}
>
  {saving ? "Saving..." : "Save Changes"}
</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;