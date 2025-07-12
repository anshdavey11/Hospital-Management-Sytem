import { div } from "framer-motion/client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    uniqueId: ""
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
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.gender.trim()) newErrors.gender = "Gender is required.";
    if (!form.dob.trim()) newErrors.dob = "Date of birth is required.";
    if (!form.uniqueId.trim()) newErrors.uniqueId = "Unique ID is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setLoginMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const existing = patients.find((p) => p.uniqueId === form.uniqueId);

    if (existing) {
      setLoginMessage("User already exists. Logging in...");
      setTimeout(() => {
        navigate("/bookAppointment"); // redirect if desired
      }, 1000);
      return;
    }

    const patientData = {
      ...form,
      id: Date.now().toString()
    };

    patients.push(patientData);
    localStorage.setItem("patients", JSON.stringify(patients));

    setSubmitted(true);
    setForm({ name: "", gender: "", dob: "", uniqueId: "" });
    setTimeout(() => {
      navigate("/bookAppointment");
    }, 1000);
  };

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => setSubmitted(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-[100vh]">
        <div className="w-1/2 bg-white mx-auto p-4  rounded-xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-[#912D29]">Patient Registration</h2>
      {submitted && <div className="text-green-600">Patient registered successfully!</div>}
      {loginMessage && <div className="text-blue-600">{loginMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-100 p-2 w-9/10 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="bg-gray-100 p-2 w-1/5 rounded pl-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>
        {/* <br /> */}
        <div>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="bg-gray-100 p-2 w-9/10 rounded"
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>
    {/* <br /> */}
        <div>
          <input
            name="uniqueId"
            placeholder="Aadhar / Passport Number"
            value={form.uniqueId}
            onChange={handleChange}
            className="bg-gray-100 p-2 w-9/10 rounded"
          />
          {errors.uniqueId && <p className="text-red-500 text-sm">{errors.uniqueId}</p>}
        </div>
        {/* <br /> */}
        <button
          type="submit"
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#5f3736] hover:cursor-pointer"
        >
          Register / Login
        </button>
      </form>
    </div>
    </div>
    
  );
}

export default User;
