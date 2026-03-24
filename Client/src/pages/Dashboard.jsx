import DashboardLayout from "../components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeWithAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenue, // pass current revenue
          message: "Analyze my business revenue trends",
        }),
      });

      const data = await res.json();
      setAiReply(data.reply);
    } catch (err) {
      console.error(err);
      setAiReply("Failed to get AI insights. Showing fallback reply.");
    } finally {
      setLoading(false);
    }
  };

  const navbarLinks = [{ name: "Dashboard", path: "/dashboard" }];

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    newUsersThisMonth: 0,
  });

  const [revenue, setRevenue] = useState(0);
  const [filter, setFilter] = useState("thisMonth");

  const [growth, setGrowth] = useState(0);
  const [growthFilter, setGrowthFilter] = useState("month");

  const [revenueData, setRevenueData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  // Fetch revenue summary
  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/revenue?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => setRevenue(data.revenue));
  }, [filter]);

  // Fetch growth summary
  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/growth?filter=${growthFilter}`)
      .then((res) => res.json())
      .then((data) => setGrowth(data.growth));
  }, [growthFilter]);

  // Fetch monthly revenue chart
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/monthly-revenue")
      .then((res) => res.json())
      .then((data) => {
        const monthNames = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const formatted = data.map((item) => ({
          name: monthNames[item._id - 1],
          revenue: item.revenue,
        }));

        setRevenueData(formatted);
      });
  }, []);

  // Fetch monthly growth chart
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/monthly-growth")
      .then((res) => res.json())
      .then((data) => {
        const monthNames = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const formatted = data.map((item) => ({
          name: monthNames[item._id - 1],
          users: item.users,
        }));

        setGrowthData(formatted);
      });
  }, []);

  // Fetch stats
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  const pieData = [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 200 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <DashboardLayout navbarLinks={navbarLinks}>
      <div className="space-y-6">

        {/* AI Analysis */}
        <button
          onClick={analyzeWithAI}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          {loading ? "Analyzing..." : "Analyze with AI 🤖"}
        </button>
        {aiReply && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
            <h3 className="font-bold mb-2">AI Analysis</h3>
            <p>{aiReply}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Admin Users</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalAdmins}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">New Users This Month</h3>
            <p className="text-2xl font-bold mt-2">{stats.newUsersThisMonth}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between">
              <h3 className="text-gray-500 text-sm">Revenue</h3>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
            <p className="text-2xl font-bold mt-2">₹{revenue}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between">
              <h3 className="text-gray-500 text-sm">Growth</h3>
              <select value={growthFilter} onChange={(e) => setGrowthFilter(e.target.value)}>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <p className="text-2xl font-bold mt-2">{growth}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Line Chart */}
          {revenueData && revenueData.some(item => item.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px dashed #d1d5db"
              }}
            >
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#16a34a" }}>₹</div>
              <h3 style={{ margin: "10px 0 5px 0", color: "#374151" }}>No Revenue Yet</h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Revenue data will appear here once transactions are recorded.
              </p>
            </div>
          )}

          {/* Growth Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow h-80">
            <h2 className="text-lg font-semibold mb-4">Monthly Growth</h2>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow h-80 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Device Usage</h2>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;