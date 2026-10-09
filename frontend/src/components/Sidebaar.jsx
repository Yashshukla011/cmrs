import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebaar.css";
const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Customers", path: "/customers", icon: "♙" },
  { label: "Loans", path: "/loans", icon: "₹" },
  { label: "Cash Collections", path: "/collections", icon: "◈" },
  { label: "Reconciliation", path: "/reconciliation", icon: "⇄" },
  { label: "Bank Deposits", path: "/deposits", icon: "▤" },
  { label: "Settlements", path: "/settlements", icon: "↔" },
];

export default function Sidebaar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="cmrs-sidebar">
      {/* Brand */}
      <div className="cmrs-brand">
        <div className="cmrs-brand-icon">₹</div>
        <div className="cmrs-brand-text">
          <h2>CMRS</h2>
          <p>Finance Operations</p>
        </div>
      </div>

      <div className="cmrs-sidebar-divider" />

      {/* Workspace */}
      <div className="cmrs-workspace">
        <span className="cmrs-section-dot" />
        WORKSPACE
      </div>

      {/* Navigation */}
      <nav className="cmrs-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `cmrs-nav-item ${isActive ? "active" : ""}`
            }
            end={item.path === "/dashboard"}
          >
            <span className="cmrs-nav-icon">{item.icon}</span>
            <span className="cmrs-nav-label">{item.label}</span>

            {item.path === "/dashboard" && (
              <span className="cmrs-nav-badge">Home</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom information */}
      <div className="cmrs-sidebar-bottom">
        <div className="cmrs-security-card">
          <div className="cmrs-security-icon">✓</div>
          <div>
            <h4>Secure Workspace</h4>
            <p>Finance operations portal</p>
          </div>
        </div>

        <button
          type="button"
          className="cmrs-logout"
          onClick={logout}
        >
          <span className="cmrs-logout-icon">⇥</span>
          <span>Logout</span>
          <span className="cmrs-logout-arrow">→</span>
        </button>

        <div className="cmrs-sidebar-footer">
          <span className="cmrs-footer-dot" />
          CMRS Portal · v1.0
        </div>
      </div>
    </aside>
  );
}
