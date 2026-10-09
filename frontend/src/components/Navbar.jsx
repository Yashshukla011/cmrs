import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/collections": "Cash Collections",
  "/reconciliation": "Reconciliation",
  "/deposits": "Deposits",
  "/settlements": "Settlements",
};

const Navbar = () => {
  const location = useLocation();

  const currentPage =
    pageTitles[location.pathname] || "CMRS Portal";

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const userName = user.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user.username || user.name || "CMRS User";

  const userRole = user.role || user.user_type || "User";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm md:px-8">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
          {currentPage}
        </h2>

        <p className="mt-1 text-xs text-slate-500 md:text-sm">
          Cash Management & Reconciliation System
        </p>
      </div>

      {/* User information */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-700">
            {today}
          </p>

          <p className="text-xs capitalize text-slate-500">
            {userRole.replaceAll("_", " ")}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold uppercase text-blue-700">
          {userName.charAt(0)}
        </div>

        <div className="hidden sm:block">
          <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>

          <p className="text-xs text-slate-500">
            Logged in
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
