import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchApi } from "../utils/api";
import Loading from "../components/Loading";
import { setCookies, tokenCookiesName } from "../utils/cookies";

function Login() {
  const { setTokenCtx } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApi("/auth/login", "POST", credentials);
      setTokenCtx(data.data.token);
      setCookies(tokenCookiesName, data.data.token);
      navigate("/");
    } catch (err) {
      if (err.message === "Validation Failed") {
        const emailOrUsernameError = err.error.filter(
          (e) => e.path === "emailOrUsername"
        )[0];
        const passwordError = err.error.filter((e) => e.path === "password")[0];
        setError({ emailOrUsernameError, passwordError });
      } else {
        setError({ message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <>
      <div className="hero bg-base-200">
        <div className="hero-content flex-col min-w-[80%]">
          <h1 className="text-3xl font-bold">Login</h1>
          <form
            onSubmit={handleSubmit}
            className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          >
            <div className="card-body">
              {error?.message && (
                <p className="text-error text-center">{error?.message}</p>
              )}
              <div className="form-control">
                <label>Email/Username</label>
                <input
                  type="emailOrUsername"
                  className="input input-bordered"
                  value={credentials.emailOrUsername}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      emailOrUsername: e.target.value,
                    })
                  }
                />
                {error?.emailOrUsernameError && (
                  <p className="text-error text-center">
                    {error.emailOrUsernameError.message}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label>Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                {error?.passwordError && (
                  <p className="text-error text-center">
                    {error.passwordError.message}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-5">
            Don&apos;t have an account?{" "}
            <Link to={"/auth/register"} className="link">
              Register
            </Link>
          </div>
        </div>
      </div>
      {loading && <Loading text="Logging in..." />}
    </>
  );
}

export default Login;
