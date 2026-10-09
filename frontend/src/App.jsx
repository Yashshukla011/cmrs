import { useState } from "react";
import {
BrowserRouter,
Navigate,
Outlet,
Route,
Routes,
useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebaar";
import Dashboard from "./pages/Dashboard";
import ModulePage from "./pages/ModulePage";
import "./index.css";

function ProtectedLayout() {
const token = localStorage.getItem("access");

if (!token) {
return <Navigate to="/login" replace />;
}

return ( <div className="app-layout"> <Sidebar />


  <main className="main-content">
    <Outlet />
  </main>
</div>
);
}

function Login() {
const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(event) {
event.preventDefault();

setLoading(true);
setError("");

try {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  const response = await fetch(
    "http://127.0.0.1:8000/api/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed. Username and password check karo."
    );
  }

  if (!data.access || !data.refresh) {
    throw new Error("Django se JWT tokens nahi mile.");
  }

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  navigate("/dashboard", { replace: true });
} catch (err) {
  console.error("Login error:", err);

  setError(
    err.message || "Backend se connect nahi ho pa raha."
  );
} finally {
  setLoading(false);
}
}

return ( 
  
<div className="login-page"> <form className="login-card" onSubmit={handleSubmit}> <div className="brand-icon">₹</div>

    <p className="eyebrow">FINANCE OPERATIONS</p>

    <h1>CMRS Login</h1>

    <p className="muted">
      Sign in to manage cash operations.
    </p>

    {error && (
      <div className="dashboard-error" role="alert">
        {error}
      </div>
    )}

    <label htmlFor="username">Username</label>

    <input
      id="username"
      type="text"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      placeholder="Enter your Django username"
      autoComplete="username"
      required
    />

    <label htmlFor="password">Password</label>

    <input
      id="password"
      type="password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      placeholder="Enter your password"
      autoComplete="current-password"
      required
    />

    <button
      className="primary-button"
      type="submit"
      disabled={loading}
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>
  </form>
</div>

);
}

function AppRoutes() {
const token = localStorage.getItem("access");

return ( <Routes>
<Route
path="/login"
element={
token ? ( <Navigate to="/dashboard" replace />
) : ( <Login />
)
}
/>

  <Route element={<ProtectedLayout />}>
    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/customers"
      element={
        <ModulePage
          title="Customers"
          endpoint="/customers/"
          description="Manage customer profiles and repayment history."
        />
      }
    />

    <Route
      path="/loans"
      element={
        <ModulePage
          title="Loans"
          endpoint="/loans/"
          description="Manage loans and outstanding balances."
        />
      }
    />

    <Route
      path="/collections"
      element={
        <ModulePage
          title="Cash Collections"
          endpoint="/collections/"
          description="Track customer repayments and agent receipts."
        />
      }
    />

    <Route
      path="/reconciliation"
      element={
        <ModulePage
          title="Reconciliation"
          endpoint="/reconciliation/"
          description="Compare expected and received cash."
        />
      }
    />

    <Route
      path="/deposits"
      element={
        <ModulePage
          title="Bank Deposits"
          endpoint="/deposits/"
          description="Track branch cash deposits into bank accounts."
        />
      }
    />

    <Route
      path="/settlements"
      element={
        <ModulePage
          title="Settlements"
          endpoint="/settlements/"
          description="Track bank settlement status and differences."
        />
      }
    />
  </Route>

  <Route
    path="/"
    element={
      <Navigate
        to={token ? "/dashboard" : "/login"}
        replace
      />
    }
  />

  <Route
    path="*"
    element={
      <Navigate
        to={token ? "/dashboard" : "/login"}
        replace
      />
    }
  />
</Routes>

);
}

export default function App() {
return ( <BrowserRouter> <AppRoutes /> </BrowserRouter>
);
}
