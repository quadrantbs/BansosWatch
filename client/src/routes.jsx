import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import { getCookies, tokenCookiesName, userCookiesName } from "./utils/cookies";
import HomePage from "./pages/HomePage";
import ReportListPage from "./pages/ReportListPage";
import ReportFormPage from "./pages/ReportFormPage";
import AdminVerifyPage from "./pages/AdminVerifyPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/auth/",
    element: <AuthLayout />,
    loader: () => {
      const access_token = getCookies(tokenCookiesName);
      if (access_token) {
        throw redirect("/");
      }
      return null;
    },
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    loader: () => {
      const access_token = getCookies(tokenCookiesName);
      if (access_token) {
        return null;
      }
      throw redirect("/auth/login");
    },
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/reports/form",
        element: <ReportFormPage />,
      },
      {
        path: "/reports/list",
        element: <ReportListPage />,
      },
    ],
  },
  {
    path: "/admin/",
    element: <RootLayout />,
    loader: () => {
      const access_token = getCookies(tokenCookiesName);
      const user = JSON.parse(getCookies(userCookiesName));
      if (access_token && user.role === "admin") {
        return null;
      } else if (access_token) {
        throw redirect("/");
      }
      throw redirect("/");
    },
    children: [
      {
        path: "verify",
        element: <AdminVerifyPage />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
    ],
  },
]);
