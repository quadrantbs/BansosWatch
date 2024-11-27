import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold">Bansos Watch</h1>
        <p className="text-md text-gray-600">
          Monitoring and Evaluation System for Social Assistance Programs
        </p>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
