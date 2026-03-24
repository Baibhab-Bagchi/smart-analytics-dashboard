import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, {useState} from "react";

const Navbar = ({ links = [] }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
  setLoggingOut(true);

  try {
    // artificial delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await logout();
    navigate("/login", {replace:true});
  } catch (err) {
    console.error(err);
  } finally {
    setLoggingOut(false);
  }
};

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 transition"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          {typeof user?.email === "string" ? user.email : ""}
        </span>

       <button
  onClick={handleLogout}
  disabled={loggingOut}
  className={`px-4 py-2 rounded-lg text-white transition flex items-center justify-center cursor-pointer
    ${loggingOut
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
    }`}
>
  {loggingOut ? (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer"></div>
  ) : (
    "Logout"
  )}
</button>
      </div>
    </nav>
  );
};

export default Navbar;