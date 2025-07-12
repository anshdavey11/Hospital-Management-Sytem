import React, { useEffect, useState } from "react";

function ShowAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const currentPatientId = localStorage.getItem("currentPatientId");
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");

    const loggedInPatient = patients.find(p => p.id === currentPatientId);
    const myAppointments = allAppointments.filter(appt => appt.patientId === currentPatientId);

    setPatient(loggedInPatient);
    setAppointments(myAppointments);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {patient && <p className="mb-4 text-gray-700">Welcome, {patient.name}</p>}

      {appointments.length === 0 ? (
        <div className="text-red-500 font-medium">No appointments available.</div>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="p-4 border rounded shadow bg-white">
              <p><strong>Doctor:</strong> {appt.doctorName}</p>
              <p><strong>Department:</strong> {appt.department}</p>
              <p><strong>Time Slot:</strong> {appt.slot}</p>
              <p><strong>Hospital PIN:</strong> {appt.hospitalPin}</p>
              <p><strong>Consultation Fee:</strong> ₹{appt.fee}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowAppointment;
