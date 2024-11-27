/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { fetchApi } from "../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

const AdminVerifyPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const { tokenCtx } = useContext(AuthContext);
  const limit = 10;

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(
        `/reports?page=${page}&limit=${limit}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${tokenCtx}`,
        }
      );
      setReports(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReport) return;
    try {
      setLoading(true);
      await fetchApi(`/reports/${selectedReport}/verify`, "PATCH", null, {
        Authorization: `Bearer ${tokenCtx}`,
      });
      toast.success("Report approved successfully.");
      fetchReports();
      setSelectedReport(null);
    } catch (error) {
      console.error("Error approving report:", error);
      toast.error("Failed to approve report.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReport) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        additional_notes: `Rejected Reason: ${rejectReason}`,
      };

      await fetchApi(`/reports/${selectedReport}/reject`, "PATCH", payload, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCtx}`,
      });

      toast.success("Report rejected successfully.");
      fetchReports();
      setSelectedReport(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("Failed to reject report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (url) => {
    if (url.endsWith(".pdf")) {
      return (
        <embed
          src={url}
          className="w-48 h-48 border sm:table-cell hidden"
          type="application/pdf"
          title="Proof Preview"
        />
      );
    }
    return (
      <img
        src={url}
        alt="Proof"
        className="w-48 h-48 border object-cover sm:table-cell hidden"
      />
    );
  };

  const handleDownload = async (
    url,
    program_name,
    region,
    distribution_date,
    number_of_recipients
  ) => {
    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const blob = await response.blob();

      const regionString = `${region.province?.name || ""}_${
        region.city_or_district?.name || ""
      }_${region.subdistrict?.name || ""}`.replace(/\s+/g, "_");

      const fileName = `${program_name.replace(
        /\s+/g,
        "_"
      )}_${regionString}_${distribution_date}_${number_of_recipients}_Proof_of_Distribution`.replace(
        /[^a-zA-Z0-9_]/g,
        ""
      );

      const link = document.createElement("a");
      const urlBlob = URL.createObjectURL(blob);
      link.href = urlBlob;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download the file.");
    }
  };

  const handleSelectApprove = (id) => {
    setSelectedReport(id);
    setRejectReason(null);
  };

  const handleSelectReject = (id) => {
    setSelectedReport(id);
    setRejectReason("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin Verify Reports
      </h1>
      {loading && <Loading text="Loading reports..." />}
      {!loading && reports.length === 0 && (
        <p className="text-gray-600">No reports available.</p>
      )}
      {!loading && reports.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="table-auto table-zebra mx-auto mb-4">
                <thead>
                  <tr className="bg-primary text-primary-content text-center">
                    <th className="p-2">Program Name</th>
                    <th className="p-2">Region</th>
                    <th className="p-2 sm:table-cell hidden">Recipients</th>
                    <th className="p-2 sm:table-cell hidden">
                      Distribution Date
                    </th>
                    <th className="p-2">Proof</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td className="p-2">{report.program_name}</td>
                      <td className="p-2">
                        <div className="whitespace-normal break-words">
                          {`${report.region.province?.name}, ${report.region.city_or_district?.name}, ${report.region.subdistrict?.name}`}
                        </div>
                      </td>

                      <td className="p-2 sm:table-cell hidden">
                        {report.recipients_count}
                      </td>
                      <td className="p-2 sm:table-cell hidden">
                        {report.distribution_date}
                      </td>
                      <td className="p-2 sm:flex flex-col items-center align-middle table-cell">
                        {handlePreview(report.proof_of_distribution)}
                        <button
                          onClick={() =>
                            handleDownload(
                              report.proof_of_distribution,
                              report.program_name,
                              report.region,
                              report.recipients_count,
                              report.distribution_date
                            )
                          }
                          className="btn btn-secondary btn-sm sm:mt-2 my-auto"
                        >
                          Download
                        </button>
                      </td>
                      <td className="p-2 capitalize text-center">
                        {report.status}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="mx-auto align-middle flex md:flex-row flex-col">
                          <button
                            className="btn btn-sm btn-success md:mr-2 md:mb-0 mb-2 mx-auto"
                            onClick={() => handleSelectApprove(report._id)}
                            disabled={report.status !== "pending"}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleSelectReject(report._id)}
                            disabled={report.status !== "pending"}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4 w-[90%] mx-auto">
              <button
                className="btn btn-secondary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {rejectReason !== null
                ? `Confirm Rejection for ${
                    reports.find((r) => r._id === selectedReport)?.program_name
                  }`
                : `Confirm Approval for ${
                    reports.find((r) => r._id === selectedReport)?.program_name
                  }`}
            </h2>

            {/* Show textarea only for rejection */}
            {rejectReason !== null && (
              <textarea
                placeholder="Enter rejection reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="textarea textarea-bordered w-full mb-4"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-error"
                onClick={() => {
                  setSelectedReport(null);
                  setRejectReason(null); // Reset reject reason state
                }}
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  rejectReason !== null ? "btn-error" : "btn-primary"
                }`}
                onClick={() => {
                  if (rejectReason !== null) {
                    if (!rejectReason.trim()) {
                      toast.error("Please provide a reason for rejection.");
                      return;
                    }
                    handleReject();
                  } else {
                    handleApprove();
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifyPage;
