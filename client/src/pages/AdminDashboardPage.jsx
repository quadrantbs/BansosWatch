/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { fetchApi } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tokenCtx } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/reports/stats", "GET", null, {
        Authorization: `Bearer ${tokenCtx}`,
      });
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformRegionData = (distributionByRegion) => {
    const regions = [];
    const counts = [];

    for (const [province, districts] of Object.entries(distributionByRegion)) {
      for (const [district, subdistricts] of Object.entries(districts)) {
        for (const [subdistrict, count] of Object.entries(subdistricts)) {
          regions.push(`${province} - ${district} - ${subdistrict}`);
          counts.push(count);
        }
      }
    }
    return { regions, counts };
  };

  if (loading) return <Loading text="Loading statistics..." />;
  if (!stats) return <p className="text-gray-600">No data available.</p>;

  const { totalReports, recipientsByProgram, distributionByRegion } = stats;

  // Prepare data for the pie chart
  const pieData = {
    labels: Object.keys(recipientsByProgram),
    datasets: [
      {
        data: Object.values(recipientsByProgram),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Prepare data for the bar chart
  const { regions, counts } = transformRegionData(distributionByRegion);
  const barData = {
    labels: regions,
    datasets: [
      {
        label: "Number of Distributions",
        data: counts,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="container md:w-[700px] sm:w-[500px] w-[400px] mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Distribution Statistics</h1>

      {/* Total Reports */}
      <div className="bg-primary text-primary-content p-4 rounded-lg mb-6 shadow-2xl text-center">
        <h2 className="text-lg font-bold">Total Reports</h2>
        <p className="text-3xl font-semibold">{totalReports}</p>
      </div>

      {/* Recipients by Program - Pie Chart */}
      <div className="bg-base-300 text-base-content p-4 rounded-lg mb-6 shadow-2xl">
        <h2 className="text-lg font-bold text-center mb-4">
          Recipients by Program
        </h2>
        <Pie data={pieData} />
      </div>

      {/* Distribution by Region - Bar Chart */}
      <div className="bg-base-300 text-base-content p-4 rounded-lg shadow-2xl">
        <h2 className="text-lg font-bold text-center mb-4">
          Distribution by Region
        </h2>
        <Bar
          data={barData}
          options={{
            indexAxis: "y",
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
