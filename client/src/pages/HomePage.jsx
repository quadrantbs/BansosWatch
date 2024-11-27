import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="max-w-screen-lg mx-auto my-10 px-6 text-center">
        <h1 className="text-4xl font-bold mb-5 text-primary">BansosWatch</h1>
        <p className="mb-5 text-lg text-neutral">
          Welcome to <span className="font-bold">BansosWatch</span>, the
          platform for monitoring and reporting social aid distributions with
          transparency and accuracy.
        </p>

        <div className="flex justify-center items-center mb-8">
          <img
            src="/assets/bansoswatch-banner.png"
            alt="BansosWatch Banner"
            className="w-full max-w-screen-lg h-[500px] rounded-lg shadow-lg object-cover object-top"
          />
        </div>

        <div className="space-y-4">
          <Link to="/reports/form">
            <button
              className="btn btn-secondary btn-lg w-48"
            >
              Submit a Report
            </button>
          </Link>
          <Link to="/reports/list">
            <button
              className="btn btn-primary btn-lg w-48"
            >
              View Reports
            </button>
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Why Choose BansosWatch?
          </h2>
          <p className="text-neutral">
            At BansosWatch, we empower communities to ensure fair and effective
            distribution of social aid. Monitor program progress or report any
            irregularities directly through our platform.
          </p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
