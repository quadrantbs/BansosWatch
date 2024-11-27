import { useState, useEffect, useContext } from "react";
import { fetchApi } from "../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/uploadCloudinaryFile";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const ReportFormPage = () => {
  const [form, setForm] = useState({
    program_name: "",
    region: {
      province: {},
      city_or_district: {},
      subdistrict: {},
    },
    recipients_count: 0,
    distribution_date: "",
    additional_notes: "",
    proof_of_distribution_file: null,
  });
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { tokenCtx } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch provinces.");
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
      console.error(error);
      toast.error("Failed to fetch cities.");
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
      console.error(error);
      toast.error("Failed to fetch subdistricts.");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleRegionChange = (type, selected) => {
    setForm({
      ...form,
      region: {
        ...form.region,
        [type]: { id: selected.id, name: selected.name },
      },
    });
    setErrors({ ...errors, region: null });

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 2 MB. Please select a smaller file.");
      e.target.value = "";
      return;
    }
    setForm({ ...form, proof_of_distribution_file: file });
    setErrors({ ...errors, proof_of_distribution: null });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let uploadedUrl = "";

      if (form.proof_of_distribution_file) {
        uploadedUrl = await uploadToCloudinary(form.proof_of_distribution_file);
      }

      const newReport = {
        ...form,
        proof_of_distribution: uploadedUrl,
        proof_of_distribution_file: undefined,
      };

      await fetchApi("/reports", "POST", newReport, {
        Authorization: `Bearer ${tokenCtx}`,
      });

      toast.success("Report created successfully.");
      setForm({
        program_name: "",
        region: { province: {}, city_or_district: {}, subdistrict: {} },
        recipients_count: "",
        distribution_date: "",
        additional_notes: "",
        proof_of_distribution_file: null,
      });
      navigate("/reports/list");
    } catch (error) {
      console.error("Error creating report:", error);
      if (error.message === "Validation Failed") {
        const validationErrors = {};
        error.error.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.log(error);
      }
      toast.error("Failed to create report.");
    } finally {
      setLoading(false);
    }
  };

  const programOptions = [
    "Program Keluarga Harapan (PKH)",
    "Bantuan Pangan Non-Tunai (BPNT)",
    "Bantuan Langsung Tunai (BLT)",
    "Bantuan Pangan Beras",
    "Program Indonesia Pintar (PIP)",
    "Cadangan Beras Pemerintah (CBP)",
  ];

  return (
    <div className="p-6 w-full container overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Report</h2>
      {loading ? (
        <Loading text="Submitting report..." />
      ) : (
        <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px]">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Program Name</label>
            <select
              name="program_name"
              value={form.program_name}
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
            {errors?.program_name && (
              <p className="text-error text-center">{errors.program_name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Region</label>
            <div className="space-y-2">
              <select
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
              {errors?.region && (
                <p className="text-error text-center">{errors.region}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Recipients</label>
            <input
              type="number"
              name="recipients_count"
              value={form.recipients_count}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            {errors?.recipients_count && (
              <p className="text-error text-center">
                {errors.recipients_count}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Distribution Date
            </label>
            <input
              type="date"
              name="distribution_date"
              value={form.distribution_date}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            {errors?.distribution_date && (
              <p className="text-error text-center">
                {errors.distribution_date}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Additional Notes (Optional)
            </label>
            <textarea
              name="additional_notes"
              value={form.additional_notes}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
            />
            {errors?.additional_notes && (
              <p className="text-error text-center">
                {errors.additional_notes}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Proof of Distribution
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {errors?.proof_of_distribution && (
              <p className="text-error text-center">
                {errors.proof_of_distribution}
              </p>
            )}
          </div>
          <button className="btn btn-success w-full" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportFormPage;
