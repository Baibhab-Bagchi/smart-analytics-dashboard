import { Link } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import { useAuth } from "../context/AuthContext"
const Sidebar = () => {
   const { user } = useAuth();
  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 text-black dark:text-white fixed transition-colors duration-300">
      <div className="p-5 text-2xl font-bold border-b border-gray-300 dark:border-gray-700">
        MyApp
      </div>

      <ul className="mt-5 space-y-2 px-4">
        <li>
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/profile" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Profile
          </Link>
        </li>

        <li>
          <Link to="/settings" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Settings
          </Link>
        </li>
      {user?.role === "admin" && (
  <li>
    <Link
      to="/admin"
      className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      Admin Dashboard
    </Link>
  </li>
)}
      </ul>
    </div>
  )
}

export default Sidebar