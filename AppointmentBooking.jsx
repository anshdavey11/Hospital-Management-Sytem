import { div } from "framer-motion/m";
import React, { useState, useEffect } from "react";

function AppointmentBooking() {
  const [specialization, setSpecialization] = useState("");
  const [hospitalPin, setHospitalPin] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [fee, setFee] = useState(0);
  const [date, setDate] = useState("");
  const [patientId, setPatientId] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [displayTriggered, setDisplayTriggered] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  useEffect(() => {
    const loadedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const loadedHospitals = JSON.parse(localStorage.getItem("admins") || "[]");
    const loadedPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    setDoctors(loadedDoctors);
    setHospitals(loadedHospitals);
    setPatients(loadedPatients);
  }, []);

  useEffect(() => {
    if (!hospitalPin) return;
    const hospital = hospitals.find((h) => h.pin === hospitalPin);
    if (!hospital) return;

    const hospitalDepartments = (hospital.departments || []).map((d) =>
      d.toLowerCase()
    );

    const matchedDepartments = new Set();
    doctors.forEach((doc) => {
      doc.associations.forEach((assoc) => {
        if (
          assoc.hospitalPin === hospitalPin &&
          assoc.timeSlots.length > 0 &&
          hospitalDepartments.includes(assoc.department.toLowerCase())
        ) {
          matchedDepartments.add(assoc.department);
        }
      });
    });

    const deptArray = Array.from(matchedDepartments);
    setAvailableDepartments(deptArray);
    if (!deptArray.includes(specialization)) {
      setSpecialization("");
    }
  }, [hospitalPin, hospitals, doctors]);

  useEffect(() => {
    if (specialization && hospitalPin) {
      const matched = doctors.filter((doc) =>
        doc.associations.some(
          (assoc) =>
            assoc.hospitalPin === hospitalPin &&
            assoc.department === specialization &&
            assoc.timeSlots.length > 0
        )
      );
      setAvailableDoctors(matched);
      setSelectedDoctorId("");
      setSelectedSlot("");
      setFee(0);
    }
  }, [specialization, hospitalPin, doctors]);

  useEffect(() => {
    if (selectedDoctorId && hospitalPin && specialization) {
      const doc = doctors.find((d) => d.id === selectedDoctorId);
      const assoc = doc?.associations.find(
        (a) => a.hospitalPin === hospitalPin && a.department === specialization
      );
      setFee(assoc?.fee || 0);
    }
  }, [selectedDoctorId, hospitalPin, specialization, doctors]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!patientId || !selectedDoctorId || !selectedSlot || !fee || !date) return;

    // Don't accept past dates
    if (new Date(date) < new Date(today)) {
      alert("Please select today or a future date.");
      return;
    }

    const updatedDoctors = doctors.map((doc) => {
      if (doc.id === selectedDoctorId) {
        return {
          ...doc,
          associations: doc.associations.map((assoc) => {
            if (
              assoc.hospitalPin === hospitalPin &&
              assoc.department === specialization &&
              assoc.timeSlots.includes(selectedSlot)
            ) {
              return {
                ...assoc,
                timeSlots: assoc.timeSlots.filter((slot) => slot !== selectedSlot),
              };
            }
            return assoc;
          }),
        };
      }
      return doc;
    });

    const doc = doctors.find((d) => d.id === selectedDoctorId);
    const assoc = doc?.associations.find(
      (a) => a.hospitalPin === hospitalPin && a.department === specialization
    );

    const booking = {
      id: Date.now().toString(),
      patientId,
      doctorId: selectedDoctorId,
      doctorName: doc.name,
      hospitalPin,
      department: assoc?.department || specialization,
      slot: selectedSlot,
      fee: Number(fee),
      date, // ✅ Date added
    };

    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    existing.push(booking);
    localStorage.setItem("appointments", JSON.stringify(existing));
    localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
    setSubmitted(true);

    setSelectedDoctorId("");
    setSelectedSlot("");
    setFee(0);
    setDate("");
  };

  const displayAppointments = () => {
    if (!patientId) {
      alert("Please select a patient to view appointments.");
      return;
    }

    const allAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    const patientAppointments = allAppointments.filter(
      (a) => a.patientId === patientId
    );
    setAppointments(patientAppointments);
    setDisplayTriggered(true);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-[100vh]">
        <div className="w-1/2 bg-white mx-auto p-4  rounded-xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-[#912D29]">Book an Appointment</h2>
      {submitted && (
        <div className="text-green-600">Appointment booked successfully!</div>
      )}

      <form onSubmit={handleBooking} className="space-y-3">
        <select
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
            setDisplayTriggered(false);
            setAppointments([]);
          }}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.uniqueId})
            </option>
          ))}
        </select>

        <select
          value={hospitalPin}
          onChange={(e) => setHospitalPin(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Hospital</option>
          {hospitals.map((h) => (
            <option key={h.pin} value={h.pin}>
              {h.hospitalName} - {h.location}
            </option>
          ))}
        </select>

        {hospitalPin && (
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Department</option>
            {availableDepartments.length > 0 ? (
              availableDepartments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))
            ) : (
              <option disabled>No departments available</option>
            )}
          </select>
        )}

        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Doctor</option>
          {availableDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.name} ({doc.qualifications})
            </option>
          ))}
        </select>

        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Time Slot</option>
          {(availableDoctors.find((d) => d.id === selectedDoctorId)?.associations.find(
            (a) => a.hospitalPin === hospitalPin && a.department === specialization
          )?.timeSlots || []).map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          className="border p-2 w-full rounded"
        />

        <div className="border p-2 w-full rounded bg-gray-100">
          <strong>Consultation Fee:</strong> ₹{fee || 0}
        </div>

        <button
          type="submit"
          className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#311d1c] hover:cursor-pointer"
        >
          Book Appointment
        </button>
      </form>

      <button
        onClick={displayAppointments}
        className="bg-[#912D29] text-white px-4 py-2 rounded hover:bg-[#311d1c] hover:cursor-pointer"
      >
        Future and Past Consultations
      </button>

      {displayTriggered && appointments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Your Appointments</h3>
          <ul className="list-disc ml-5 space-y-1">
            {appointments.map((app) => (
              <li key={app.id}>
                <strong>Dr. {app.doctorName}</strong> — {app.department} —{" "}
                <em>{app.date}</em> at <em>{app.slot}</em> — ₹{app.fee}
              </li>
            ))}
          </ul>
        </div>
      )}

      {displayTriggered && appointments.length === 0 && (
        <p className="mt-4 text-red-600">No appointments found for this patient.</p>
      )}
    </div>
    </div>
    
  );
}

export default AppointmentBooking;
