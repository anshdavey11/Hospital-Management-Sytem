import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [form, setForm] = useState({
    name: "",
    hospitalName: "",
    location: "",
    pin: "",
    departments: "" // comma-separated input
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Admin name is required.";
    if (!form.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required.";
    if (!form.location.trim()) newErrors.location = "Hospital location is required.";
    if (!form.pin.trim()) newErrors.pin = "PIN is required.";
    if (!form.departments.trim()) newErrors.departments = "At least one department is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const admins = JSON.parse(localStorage.getItem("admins") || "[]");

    const existing = admins.find(
      (admin) =>
        admin.pin === form.pin &&
        admin.hospitalName.toLowerCase() === form.hospitalName.toLowerCase() &&
        admin.location.toLowerCase() === form.location.toLowerCase()
    );

    if (existing) {
      setLoginMessage("Hospital already registered. Logging you in...");
      setTimeout(() => {
        navigate("/hospitalDashboard", { state: { pin: existing.pin } });
      }, 1000);
      return;
    }

    const adminData = {
      ...form,
      id: Date.now().toString(),
      departments: form.departments.split(",").map((d) => d.trim())
    };

    admins.push(adminData);
    localStorage.setItem("admins", JSON.stringify(admins));

    setSubmitted(true);
    setForm({ name: "", hospitalName: "", location: "", pin: "", departments: "" });
    setErrors({});
    navigate("/hospitalDashboard", { state: { pin: adminData.pin } });
  };

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => setSubmitted(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 min-h-[100vh]">
        <div className="w-1/2 mx-auto p-4 border bg-white rounded-xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-[#912D29]">Hospital Admin Registration</h2>
      {submitted && <div className="text-green-600">Admin registered successfully!</div>}
      {loginMessage && <div className="text-blue-600">{loginMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Admin Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          name="hospitalName"
          placeholder="Hospital Name"
          value={form.hospitalName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.hospitalName && <p className="text-red-500 text-sm">{errors.hospitalName}</p>}

        <input
          name="location"
          placeholder="Hospital Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

        <input
          name="pin"
          placeholder="Enter Hospital PIN (unique for each hospital)"
          value={form.pin}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}

        <input
          name="departments"
          placeholder="Departments (comma-separated)"
          value={form.departments}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.departments && <p className="text-red-500 text-sm">{errors.departments}</p>}

        <button
          type="submit"
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#b96d6d] hover:cursor-pointer"
        >
          {loginMessage ? "Logging In..." : "Register / Login"}
        </button>
      </form>
    </div>
      </div>
    </>
  );
}

export default Admin;
