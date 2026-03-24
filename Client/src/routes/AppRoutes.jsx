import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import ProtectedRoute from "./ProtectedRoute"
import Profile from "../pages/profile"
import Settings from "../pages/Settings"
import PageLoader from "../components/PageLoader"
import AdminRoute from "../components/AdminRoute";
import AdminDashboard from "../pages/AdminDashboard"
 function App() {
  return (
    <BrowserRouter>
      <PageLoader>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
<Route
  path="/admin"
  element={
    <AdminRoute>
    <AdminDashboard/>
    </AdminRoute>
  }
/>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

        </Routes>
      </PageLoader>
    </BrowserRouter>
  );
}
export default App