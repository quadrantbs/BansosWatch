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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

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

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteReport(reportToDelete);
      setIsConfirmOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error(error);
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
      <div className="p-1 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Reports List
        </h1>
        {loading ? (
          <Loading text="Getting reports data..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="text-xs sm:text-base table-auto table-zebra w-full border-collapse border border-neutral mb-4">
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
                      <td className="px-4 py-2 text-center">
                        {report.recipients_count}
                      </td>
                      <td className="px-4 py-2">
                        {`${report.region.province.name}, ${report.region.city_or_district.name}, ${report.region.subdistrict.name}`}
                      </td>
                      <td className="px-4 py-2 capitalize sm:table-cell hidden text-center">
                        {report.status || "Pending"}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="flex justify-center md:flex-row flex-col">
                          <button
                            className="btn btn-sm btn-info rounded-lg md:mr-2 md:mb-0 mb-2"
                            onClick={() => handleViewReport(report)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-error rounded-lg"
                            onClick={() => handleDeleteClick(report)}
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="btn btn-secondary w-full sm:w-auto rounded-lg"
                onClick={() => fetchReports(currentPage - 1)}
              >
                Previous
              </button>
              <p className="text-center sm:text-left">
                Page {currentPage} of {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                className="btn btn-secondary w-full sm:w-auto rounded-lg"
                onClick={() => fetchReports(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {isConfirmOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-neutral text-neutral-content">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p>Are you sure you want to delete this report?</p>
            <div className="modal-action">
              <button
                className="btn btn-error rounded-md"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-outline btn-warning rounded-md"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportListPage;
