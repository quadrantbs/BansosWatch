import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Loading from "../components/Loading";

function Register() {
  const [details, setDetails] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(details);
  };

  const register = async (details) => {
    try {
      setLoading(true);
      setError(null);
      await fetchApi("/auth/register", "POST", details);
      navigate("/auth/login");
    } catch (err) {
      if (err.message === "Validation Failed") {
        const emailError = err.error.filter((e) => e.path === "email")[0];
        const usernameError = err.error.filter((e) => e.path === "username")[0];
        const passwordError = err.error.filter((e) => e.path === "password")[0];
        setError({
          emailError,
          usernameError,
          passwordError,
        });
      } else {
        setError({ message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero bg-base-200">
        <div className="hero-content flex-col min-w-[80%]">
          <h1 className="text-3xl font-bold">Register</h1>
          <form
            onSubmit={handleSubmit}
            className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          >
            <div className="card-body">
              <div className="form-control">
                <label>Email</label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={details.email}
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                />
                {error?.emailError && (
                  <p className="text-error text-center">
                    {error.emailError.message}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label>Username</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={details.username}
                  onChange={(e) =>
                    setDetails({ ...details, username: e.target.value })
                  }
                />
                {error?.usernameError && (
                  <p className="text-error text-center">
                    {error.usernameError.message}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label>Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={details.password}
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                />
                {error?.passwordError && (
                  <p className="text-error text-center">
                    {error.passwordError.message}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
          <div className="text-center mt-5">
            Already have an account?{" "}
            <Link to={"/auth/login"} className="link">
              Login
            </Link>
          </div>
        </div>
      </div>
      {loading && <Loading text="Registering..."/>}
    </>
  );
}

export default Register;
