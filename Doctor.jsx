import { div } from "framer-motion/client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Doctor() {
  const [form, setForm] = useState({
    name: "",
    qualifications: "",
    specializations: "",
    experience: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (!form.specializations.trim()) newErrors.specializations = "Specializations are required.";
    if (!form.experience || isNaN(form.experience) || form.experience < 0) {
      newErrors.experience = "Valid experience is required.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const specializations = form.specializations.split(",").map(s => s.trim());
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");

    // Check for existing doctor
    const existing = doctors.find(
      (doc) =>
        doc.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
        doc.qualifications.trim().toLowerCase() === form.qualifications.trim().toLowerCase()
    );

    if (existing) {
      setMessage("Doctor already exists. Logging you in...");
      localStorage.setItem("currentDoctorId", existing.id);
      setTimeout(() => navigate("/doctorAllign"), 1000);
      return;
    }

    const doctorId = Date.now().toString();
    const doctorData = {
      id: doctorId,
      name: form.name,
      qualifications: form.qualifications,
      specializations,
      experience: Number(form.experience),
      associations: []
    };

    doctors.push(doctorData);
    localStorage.setItem("doctors", JSON.stringify(doctors));
    localStorage.setItem("currentDoctorId", doctorId);

    setSubmitted(true);
    setMessage("Doctor registered successfully!");
    setForm({
      name: "",
      qualifications: "",
      specializations: "",
      experience: ""
    });
    setErrors({});

    setTimeout(() => {
      navigate("/doctorAllign");
    }, 1000);
  };

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => setSubmitted(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 min-h-[100vh]">
        <div className="w-1/2 min-h-[50vh] mt-10 border-2 bg-white mx-auto p-4 border rounded-xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-[#912D29]">Doctor Registration</h2>
      {message && <div className="text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Doctor Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-2/3 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          name="qualifications"
          placeholder="Qualifications"
          value={form.qualifications}
          onChange={handleChange}
          className="border p-2 w-2/3 rounded"
        />
        {errors.qualifications && <p className="text-red-500 text-sm">{errors.qualifications}</p>}

        <input
          name="specializations"
          placeholder="Specializations (comma-separated)"
          value={form.specializations}
          onChange={handleChange}
          className="border p-2 w-2/3 rounded"
        />
        {errors.specializations && <p className="text-red-500 text-sm">{errors.specializations}</p>}

        <input
          name="experience"
          type="number"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
          className="border p-2 w-2/3 rounded"
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}

        <br />
        <button
          type="submit"
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#b96d6d]"
        >
          Register Doctor
        </button>
      </form>
    </div>
  </div>
    </>
  );
}

export default Doctor;
