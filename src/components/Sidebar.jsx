import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: <FiGrid size={18} />, label: "Dashboard" },
    { path: "/projects", icon: <FiFolder size={18} />, label: "Projects" },
    { path: "/teams", icon: <FiUsers size={18} />, label: "Teams" },
    { path: "/tasks", icon: <FiCheckSquare size={18} />, label: "Tasks" },
    { path: "/reports", icon: <FiBarChart2 size={18} />, label: "Reports" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* logo */}
      <div
        className="d-flex align-items-center gap-2 p-3"
        style={{ borderBottom: "1px solid #E2E8F0" }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#4F46E5",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          T
        </div>
        <span style={{ fontWeight: "500", fontSize: "16px" }}>TaskForge</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-grow-1 p-2 mt-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              marginBottom: "2px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? "500" : "400",
              backgroundColor: isActive ? "#EEF2FF" : "transparent",
              color: isActive ? "#4F46E5" : "#64748B",
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* user info & logout */}
      <div className="p-3" style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "500",
              color: "#4F46E5",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              className="mb-0"
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#1E293B",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </p>
            <p
              className="mb-0"
              style={{
                fontSize: "11px",
                color: "#64748B",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center gap-2"
          style={{
            fontSize: "13px",
            color: "#64748B",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            padding: "7px 12px",
          }}
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
