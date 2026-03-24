import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // delay time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
    children
  );
}