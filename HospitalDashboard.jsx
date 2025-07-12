import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function HospitalDashboard() {
  const location = useLocation();
  const { pin } = location.state || {};
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    if (!pin) return;

    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    const foundHospital = admins.find((admin) => admin.pin === pin);
    setHospital(foundHospital);

    const allDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const hospitalDoctors = allDoctors.filter((doc) =>
      doc.associations.some((assoc) => assoc.hospitalPin === pin)
    );
    setDoctors(hospitalDoctors);

    const allConsultations = JSON.parse(localStorage.getItem("appointments") || "[]");
    const hospitalConsults = allConsultations.filter((c) => c.hospitalPin === pin);
    setConsultations(hospitalConsults);
  }, [pin]);

  if (!hospital) return <p className="text-center p-4">Loading hospital info...</p>;

  const totalRevenue = consultations.reduce((acc, curr) => acc + Number(curr.fee || 0), 0);
  const revenueByDoctor = {};
  const revenueByDepartment = {};

  consultations.forEach((c) => {
    const doctorName = c.doctorName;
    const dept = c.department;
    const hospitalShare = Number(c.fee || 0) * 0.4;

    // Revenue per doctor
    if (!revenueByDoctor[doctorName]) revenueByDoctor[doctorName] = 0;
    revenueByDoctor[doctorName] += hospitalShare;

    // Revenue per department
    if (!revenueByDepartment[dept]) revenueByDepartment[dept] = 0;
    revenueByDepartment[dept] += hospitalShare;
  });

  // Convert to chart data
  const doctorChartData = Object.entries(revenueByDoctor).map(([name, value]) => ({
    name,
    revenue: value,
  }));

  const departmentChartData = Object.entries(revenueByDepartment).map(([name, value]) => ({
    name,
    revenue: value,
  }));

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#912D29]">Hospital Dashboard</h1>
      <p><strong className="text-[#912D29]">Hospital:</strong> {hospital.hospitalName}</p>
      <p><strong className="text-[#912D29]">Location:</strong> {hospital.location}</p>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-[#912D29]">Associated Doctors</h2>
        {doctors.length === 0 ? (
          <p>No doctors registered for this hospital.</p>
        ) : (
          <ul className="list-disc ml-5">
            {doctors.map((doc) => (
              <li key={doc.id}>
                {doc.name} ({doc.specializations.join(", ")})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-[#912D29]">Consultation & Revenue Stats</h2>
        <p>Total Consultations: {consultations.length}</p>
        <p>Total Revenue: ₹{(totalRevenue * 0.4).toFixed(2)} (Hospital Share)</p>

        <div className="mt-3">
          <h3 className="font-semibold mb-1 text-[#912D29]">Revenue Per Doctor</h3>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={doctorChartData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4f46e5" name="₹ Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-1 text-[#912D29]">Revenue Per Department</h3>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={departmentChartData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="₹ Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;
