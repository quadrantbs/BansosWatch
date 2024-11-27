/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { fetchApi } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import ReportModal from "../components/ReportModal";
import { programNames } from "../utils/programNames";

const ReportListPage = () => {
  const { tokenCtx } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const data = await fetchApi(
        `/reports?page=${page}&limit=10`,
        "GET",
        null,
        {
          Authorization: `Bearer ${tokenCtx}`,
        }
      );
      setReports(data.data);
      setCurrentPage(data.meta.currentPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast.error(error.message || "Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (report) => {
    const id = report._id;
    try {
      await fetchApi(`/reports/${id}`, "DELETE", null, {
        Authorization: `Bearer ${tokenCtx}`,
      });
      toast.success("Report successfully deleted.");
      fetchReports(currentPage);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to delete report.");
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <ReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={() => fetchReports(currentPage)}
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Reports List</h1>
        {loading ? (
          <Loading text="Getting reports data..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto table-zebra w-full border-collapse border border-neutral mb-4 ">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th className="px-4 py-2">Program Name</th>
                    <th className="px-4 py-2">Recipients</th>
                    <th className="px-4 py-2">Region</th>
                    <th className="px-4 py-2 sm:table-cell hidden">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td className="px-4 py-2">
                        {programNames[report.program_name] ||
                          report.program_name}
                      </td>
                      <td className="px-4 py-2">{report.recipients_count}</td>
                      <td className="px-4 py-2">
                        {`${report.region.province.name}, ${report.region.city_or_district.name}, ${report.region.subdistrict.name}`}
                      </td>
                      <td className="px-4 py-2 capitalize sm:table-cell hidden">
                        {report.status || "Pending"}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="mx-auto align-middle flex md:flex-row flex-col">
                          <button
                            className="btn btn-sm btn-info md:mr-2 md:mb-0 mb-2 mx-auto"
                            onClick={() => handleViewReport(report)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => deleteReport(report)}
                            disabled={report.status === "verified"}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                className="btn btn-secondary"
                onClick={() => fetchReports(currentPage - 1)}
              >
                Previous
              </button>
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                onClick={() => fetchReports(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReportListPage;
