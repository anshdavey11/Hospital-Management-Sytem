import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function DoctorAlign() {
  const [hospitals, setHospitals] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [selectedHospitalPin, setSelectedHospitalPin] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fee, setFee] = useState("");
  const [timeSlots, setTimeSlots] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showStats, setShowStats] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const allHospitals = JSON.parse(localStorage.getItem("admins") || "[]");
    const allDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const currentDoctorId = localStorage.getItem("currentDoctorId");

    const doc = allDoctors.find((d) => d.id === currentDoctorId);
    if (!doc) {
      setError("Doctor not found.");
      return;
    }

    setHospitals(allHospitals);
    setDoctor(doc);
  }, []);

  const getAllExistingSlots = () => {
    if (!doctor?.associations) return [];
    return doctor.associations.flatMap((a) => a.timeSlots || []);
  };

  const handleAddAssociation = () => {
    setError("");
    setSuccess("");

    if (!selectedHospitalPin || !selectedDepartment || !fee || !timeSlots) {
      setError("All fields are required.");
      return;
    }

    const slotList = timeSlots.split(",").map((s) => s.trim());
    const existingSlots = getAllExistingSlots();

    const hasConflict = slotList.some((slot) => existingSlots.includes(slot));
    if (hasConflict) {
      setError("Time slot conflict with another hospital already registered.");
      return;
    }

    const allDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const currentDoctorId = localStorage.getItem("currentDoctorId");
    const doctorIndex = allDoctors.findIndex((d) => d.id === currentDoctorId);
    if (doctorIndex === -1) {
      setError("Doctor not found.");
      return;
    }

    const updatedDoctor = { ...allDoctors[doctorIndex] };
    updatedDoctor.associations = [
      ...(updatedDoctor.associations || []),
      {
        hospitalPin: selectedHospitalPin,
        department: selectedDepartment,
        fee: Number(fee),
        timeSlots: slotList,
      },
    ];

    allDoctors[doctorIndex] = updatedDoctor;
    localStorage.setItem("doctors", JSON.stringify(allDoctors));
    localStorage.setItem("currentDoctorId", updatedDoctor.id);
    setDoctor(updatedDoctor);
    setSuccess("Association added successfully!");

    setSelectedHospitalPin("");
    setSelectedDepartment("");
    setFee("");
    setTimeSlots("");
  };

  const departmentsForSelectedHospital =
    hospitals.find((h) => h.pin === selectedHospitalPin)?.departments || [];

  const matchingDepartments = departmentsForSelectedHospital.filter((dep) =>
    doctor?.specializations.some(
      (spec) => spec.toLowerCase() === dep.toLowerCase()
    )
  );

  const computeStats = () => {
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const myAppointments = allAppointments.filter((a) => a.doctorId === doctor.id);

    const totalEarnings = myAppointments.reduce((sum, app) => sum + Number(app.fee) * 0.6, 0);
    const consultCount = myAppointments.length;

    const earningsByHospital = {};
    myAppointments.forEach((app) => {
      if (!earningsByHospital[app.hospitalPin]) earningsByHospital[app.hospitalPin] = 0;
      earningsByHospital[app.hospitalPin] += Number(app.fee) * 0.6;
    });

    return {
      totalEarnings,
      consultCount,
      earningsChartData: Object.entries(earningsByHospital).map(([pin, amt]) => {
        const hosp = hospitals.find((h) => h.pin === pin);
        return { name: hosp?.hospitalName || pin, earnings: amt };
      }),
    };
  };

  const stats = showStats ? computeStats() : null;

  return (
    <>
    <div className="flex justify-center items-center bg-gray-100 min-h-[100vh]">
            <div className="w-4/5 mx-auto min-h-[50vh] p-4 border rounded-xl shadow-xl bg-white space-y-4">
      <h2 className="text-xl font-bold text-[#912D29]">Doctor-Hospital Association</h2>
      {doctor && <p className="text-gray-600">Welcome, Dr. {doctor.name}</p>}

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <div className="space-y-3">
        <select
          value={selectedHospitalPin}
          onChange={(e) => setSelectedHospitalPin(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Hospital</option>
          {hospitals.map((h) => (
            <option key={h.pin} value={h.pin}>
              {h.hospitalName} ({h.location})
            </option>
          ))}
        </select>

        {selectedHospitalPin && (
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Department</option>
            {matchingDepartments.length > 0 ? (
              matchingDepartments.map((dep, idx) => (
                <option key={idx} value={dep}>
                  {dep}
                </option>
              ))
            ) : (
              <option disabled>No matching department in this hospital</option>
            )}
          </select>
        )}

        <input
          type="number"
          placeholder="Consultation Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Time Slots (comma-separated, e.g., 9-10,11-12)"
          value={timeSlots}
          onChange={(e) => setTimeSlots(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={handleAddAssociation}
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#db8683]"
        >
          Add Hospital Association
        </button>

        <button
          onClick={() => setShowStats(true)}
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#7b514f] ml-5"
        >
          View My Earnings & Stats
        </button>

        {showStats && stats && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Total Consultations: {stats.consultCount}</h3>
            <h3 className="text-lg font-semibold">Total Earnings: ₹{stats.totalEarnings.toFixed(2)}</h3>

            <h4 className="font-semibold mt-4">Earnings by Hospital</h4>
            <ResponsiveContainer width="50%" height={300}>
              <BarChart data={stats.earningsChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
        </div>
    </>
  );
}

export default DoctorAlign;
