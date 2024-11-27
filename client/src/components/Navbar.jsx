import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";
import { removeCookies, tokenCookiesName } from "../utils/cookies";

function Navbar() {
  const { user, setTokenCtx, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setLoading(true);
    setTokenCtx(null);
    setUser(null);
    removeCookies(tokenCookiesName);
    navigate("/auth/login");
    setLoading(false);
  };

  return (
    <div className="bg-neutral text-neutral-content flex">
      <nav className="container navbar mx-auto max-w-screen-lg px-6">
        <div className="dropdown dropdown-bottom lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-3 shadow bg-neutral text-neutral-content rounded-box w-52"
          >
            <li className="hover:bg-secondary hover:text-bg-secondary-content rounded-lg">
              <Link to="/reports/form">New Report</Link>
            </li>
            <li className="hover:bg-secondary hover:text-bg-secondary-content rounded-lg">
              <Link to="/reports/list">Reports List</Link>
            </li>
            {user?.role === "admin" && (
              <>
                <li className="hover:bg-secondary hover:text-bg-secondary-content rounded-lg">
                  <Link to="/admin/verify">Verification Panel</Link>
                </li>
                <li className="hover:bg-secondary hover:text-bg-secondary-content rounded-lg">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost normal-case text-xl text-primary"
          >
            BansosWatch
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li className="hover:bg-neutral hover:text-bg-neutral-content rounded-lg">
              <Link to="/reports/form">New Report</Link>
            </li>
            <li className="hover:bg-neutral hover:text-bg-neutral-content rounded-lg">
              <Link to="/reports/list">Reports List</Link>
            </li>
            {user?.role === "admin" && (
              <>
                <li className="hover:bg-neutral hover:text-bg-neutral-content rounded-lg">
                  <Link to="/admin/verify">Verification Panel</Link>
                </li>
                <li className="hover:bg-neutral hover:text-bg-neutral-content rounded-lg">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-end">
          <p className="sm:text-base text-xs mr-5">
            Logged in as: {user?.username}
          </p>
          <button className="btn btn-error rounded-xl" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {loading && <Loading text="Logging out..." />}
    </div>
  );
}

export default Navbar;
