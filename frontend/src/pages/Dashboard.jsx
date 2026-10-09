import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../index.css";

const modules = [
  {
    key: "collections",
    title: "Cash Collections",
    subtitle: "Track cash received from customers",
    endpoint: "/collections/",
    path: "/collections",
    icon: "₹",
    color: "blue",
  },
  {
    key: "reconciliation",
    title: "Reconciliation",
    subtitle: "Compare expected and actual amounts",
    endpoint: "/reconciliation/",
    path: "/reconciliation",
    icon: "⇄",
    color: "purple",
  },
  {
    key: "deposits",
    title: "Bank Deposits",
    subtitle: "Monitor deposits made to the bank",
    endpoint: "/deposits/",
    path: "/deposits",
    icon: "▤",
    color: "green",
  },
  {
    key: "settlements",
    title: "Settlements",
    subtitle: "Review final settlement records",
    endpoint: "/settlements/",
    path: "/settlements",
    icon: "↔",
    color: "orange",
  },
];

function getCount(data) {
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data?.results)) return data.count ?? data.results.length;
  if (typeof data?.count === "number") return data.count;
  return "—";
}

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.all(
      modules.map(async (item) => {
        try {
          const response = await API.get(item.endpoint);
          return [item.key, getCount(response.data)];
        } catch (err) {
          console.error(
            `${item.title} API error:`,
            err.response?.status,
            err.response?.data || err.message
          );

          return [item.key, "—"];
        }
      })
    );

    const nextCounts = Object.fromEntries(results);
    setCounts(nextCounts);

    if (results.every(([, value]) => value === "—")) {
      setError(
        "Unable to load dashboard data. Check your login session and backend connection."
      );
    } else if (results.some(([, value]) => value === "—")) {
      setError("Some records could not be loaded. Try refreshing the dashboard.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalRecords = Object.values(counts).reduce(
    (total, count) =>
      typeof count === "number" ? total + count : total,
    0
  );

  return (
    <main className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow">
            <span className="dashboard-live-dot" />
            FINANCE OPERATIONS
          </span>

          <h1>Dashboard Overview</h1>

          <p>
            Monitor collections, reconciliation, deposits and settlements
            from one place.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={loadDashboard}
          disabled={loading}
        >
          <span className={loading ? "refresh-spin" : ""}>↻</span>
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </header>

      {/* Error message */}
      {error && (
        <div className="dashboard-alert" role="alert">
          <span className="alert-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <section className="dashboard-summary">
        <div className="summary-copy">
          <div className="summary-label">TOTAL TRANSACTION RECORDS</div>

          <div className="summary-number">
            {loading ? "..." : totalRecords}
          </div>

          <p>Combined records across the four operational modules</p>
        </div>

        <div className="summary-decoration" aria-hidden="true">
          <div className="summary-circle summary-circle-one" />
          <div className="summary-circle summary-circle-two" />
          <div className="summary-symbol">₹</div>
        </div>
      </section>

      {/* Module cards */}
      <section className="dashboard-modules">
        <div className="section-heading">
          <div>
            <h2>Operations Overview</h2>
            <p>View records and open any module.</p>
          </div>

          <span className="module-count">04 MODULES</span>
        </div>

        <div className="dashboard-stats-grid">
          {modules.map((item) => {
            const count = counts[item.key];

            return (
              <Link
                to={item.path}
                className={`dashboard-stat-card ${item.color}`}
                key={item.key}
              >
                <div className="stat-card-top">
                  <div className={`dashboard-stat-icon ${item.color}`}>
                    {item.icon}
                  </div>

                  <span className="stat-open-arrow">↗</span>
                </div>

                <p className="dashboard-stat-title">{item.title}</p>

                <h3 className="dashboard-stat-number">
                  {loading ? (
                    <span className="stat-loading">Loading</span>
                  ) : (
                    count ?? "—"
                  )}
                </h3>

                <p className="dashboard-stat-subtitle">{item.subtitle}</p>

                <div className="stat-card-footer">
                  <span>View records</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cash lifecycle */}
      <section className="lifecycle-panel">
        <div className="section-heading lifecycle-heading">
          <div>
            <h2>Cash Management Lifecycle</h2>
            <p>Follow cash from collection to final settlement.</p>
          </div>

          <span className="lifecycle-status">WORKFLOW</span>
        </div>

        <div className="lifecycle-flow">
          <div className="lifecycle-step">
            <div className="lifecycle-step-icon step-blue">₹</div>
            <div className="lifecycle-step-text">
              <strong>Collection</strong>
              <span>Cash received</span>
            </div>
          </div>

          <div className="lifecycle-connector">→</div>

          <div className="lifecycle-step">
            <div className="lifecycle-step-icon step-purple">⇄</div>
            <div className="lifecycle-step-text">
              <strong>Reconciliation</strong>
              <span>Amounts compared</span>
            </div>
          </div>

          <div className="lifecycle-connector">→</div>

          <div className="lifecycle-step">
            <div className="lifecycle-step-icon step-green">▤</div>
            <div className="lifecycle-step-text">
              <strong>Bank Deposit</strong>
              <span>Money deposited</span>
            </div>
          </div>

          <div className="lifecycle-connector">→</div>

          <div className="lifecycle-step">
            <div className="lifecycle-step-icon step-orange">✓</div>
            <div className="lifecycle-step-text">
              <strong>Settlement</strong>
              <span>Final record</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>CMRS · Cash Management & Reconciliation System</span>
        <span>
          <span className="dashboard-live-dot" /> Operational workspace
        </span>
      </footer>
    </main>
  );
}