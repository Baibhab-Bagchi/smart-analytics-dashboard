import Sidebar from "./SideBar"
import Navbar from "./Navbar"

const DashboardLayout = ({ children, navbarLinks }) => {
  return (
    <div className="flex bg-white dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar links={navbarLinks} />

        <div className="p-6 bg-gray-100 dark:bg-slate-900 min-h-[90vh] overflow-y-scroll transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout