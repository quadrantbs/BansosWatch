/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { fetchApi } from "../utils/api";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { AuthContext } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/uploadCloudinaryFile";

const ReportModal = ({ report, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tokenCtx } = useContext(AuthContext);

  useEffect(() => {
    if (report) {
      setForm(report);
      loadRegionData(report.region);
    }
    fetchProvinces();
  }, [report]);

  const loadRegionData = async (region) => {
    try {
      if (region?.province?.id) {
        await fetchCities(region.province.id);
      }
      if (region?.city_or_district?.id) {
        await fetchSubdistricts(region.city_or_district.id);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.error || "Failed to load region data.");
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.log(error);
      toast.error(error.error || "Failed to fetch provinces.");
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.log(error);
      toast.error(error.error || "Failed to fetch cities.");
    }
  };

  const fetchSubdistricts = async (cityId) => {
    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`
      );
      const data = await response.json();
      setSubdistricts(data);
    } catch (error) {
      console.log(error);
      toast.error(error.error || "Failed to fetch subdistricts.");
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (type, selected) => {
    setForm({
      ...form,
      region: {
        ...form.region,
        [type]: { id: selected.id, name: selected.name },
      },
    });

    if (type === "province") {
      fetchCities(selected.id);
      setCities([]);
      setSubdistricts([]);
    }
    if (type === "city_or_district") {
      fetchSubdistricts(selected.id);
      setSubdistricts([]);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 2 MB. Please select a smaller file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        temp_proof_of_distribution: reader.result,
        proof_of_distribution_file: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let uploadedUrl = form.proof_of_distribution;

      if (form.proof_of_distribution_file) {
        uploadedUrl = await uploadToCloudinary(form.proof_of_distribution_file);
      }
      delete form.temp_proof_of_distribution;
      delete form.proof_of_distribution_file;

      console.log(form);

      const updatedForm = {
        ...form,
        proof_of_distribution: uploadedUrl,
      };

      await fetchApi(`/reports/${form._id}`, "PUT", updatedForm, {
        Authorization: `Bearer ${tokenCtx}`,
      });

      toast.success("Report updated successfully.");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(error.error || "Failed to update report.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm(report);
  };

  if (!isOpen) return null;

  const programOptions = [
    "Program Keluarga Harapan (PKH)",
    "Bantuan Pangan Non-Tunai (BPNT)",
    "Bantuan Langsung Tunai (BLT)",
    "Bantuan Pangan Beras",
    "Program Indonesia Pintar (PIP)",
    "Cadangan Beras Pemerintah (CBP)",
  ];

  return (
    <div className="fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-neutral max-h-[80%] overflow-y-auto p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Report" : "Report Details"}
        </h2>
        {loading ? (
          <Loading text="Updating report..." />
        ) : (
          <div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Program Name</label>
              {isEditing ? (
                <select
                  name="program_name"
                  value={form.program_name || ""}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Program</option>
                  {programOptions.map((program, index) => (
                    <option key={index} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{report.program_name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Region</label>
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={form.region.province?.id || ""}
                    onChange={(e) =>
                      handleRegionChange("province", {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={form.region.city_or_district?.id || ""}
                    onChange={(e) =>
                      handleRegionChange("city_or_district", {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={form.region.subdistrict?.id || ""}
                    onChange={(e) =>
                      handleRegionChange("subdistrict", {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Subdistrict</option>
                    {subdistricts.map((subdistrict) => (
                      <option key={subdistrict.id} value={subdistrict.id}>
                        {subdistrict.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p>{`${report.region.province?.name}, ${report.region.city_or_district?.name}, ${report.region.subdistrict?.name}`}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Recipients</label>
              {isEditing ? (
                <input
                  type="number"
                  name="recipients_count"
                  value={form.recipients_count || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              ) : (
                <p>{report.recipients_count}</p>
              )}
            </div>
            {/* distribution_date */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Distribution Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="distribution_date"
                  value={form.distribution_date || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              ) : (
                <p>{report.distribution_date}</p>
              )}
            </div>
            {/* additional_notes */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Additional Notes
              </label>
              {isEditing ? (
                <textarea
                  name="additional_notes"
                  value={form.additional_notes || ""}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                />
              ) : (
                <p>{report.additional_notes}</p>
              )}
            </div>

            {/* Proof of Distribution */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Proof of Distribution
              </label>
              {isEditing ? (
                <div className="flex flex-col">
                  {form.temp_proof_of_distribution ? (
                    form.temp_proof_of_distribution.includes(
                      "application/pdf"
                    ) ? (
                      <iframe
                        src={form.temp_proof_of_distribution}
                        title="Temporary Proof of Distribution"
                        className="w-full h-96 border rounded-lg mb-4 mx-auto"
                      ></iframe>
                    ) : (
                      <img
                        src={form.temp_proof_of_distribution}
                        alt="Temporary Proof of Distribution"
                        className="max-w-full h-auto rounded-lg mb-4 mx-auto"
                      />
                    )
                  ) : form.proof_of_distribution?.endsWith(".pdf") ? (
                    <iframe
                      src={form.proof_of_distribution}
                      title="Current Proof of Distribution"
                      className="w-full h-96 border rounded-lg mb-4"
                    ></iframe>
                  ) : (
                    <img
                      src={form.proof_of_distribution}
                      alt="Current Proof of Distribution"
                      className="max-w-full h-auto rounded-lg mb-4"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              ) : (
                <div>
                  {report.proof_of_distribution?.endsWith(".pdf") ? (
                    <iframe
                      src={report.proof_of_distribution}
                      title="Proof of Distribution PDF"
                      className="w-full h-96 border rounded-lg"
                    ></iframe>
                  ) : (
                    <img
                      src={report.proof_of_distribution}
                      alt="Proof of Distribution"
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
            {/* createdAt */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Created At</label>
              <p>{new Date(report.createdAt).toLocaleString()}</p>
            </div>
            {/* updatedAt */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Updated At</label>
              <p>{new Date(report.updatedAt).toLocaleString()}</p>
            </div>
            {/* status */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Status</label>
              <p className="capitalize">{report.status}</p>
            </div>
            <div className="flex justify-between">
              <button className="btn btn-error" onClick={handleClose}>
                Close
              </button>
              {isEditing ? (
                <div className="items-end space-x-2">
                  <button className="btn btn-warning" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-warning"
                  disabled={report.status === "verified"}
                  onClick={handleEditToggle}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
