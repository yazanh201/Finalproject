import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import "../Pages/cssfiles/TablesResponsive.css"; // הוספת קובץ CSS לגלילה אופקית



const Appointments = ({ onSelectTreatment, filterAppointmentNumber }) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState({
    date: "",
    time: "",
    description: "",
    idNumber: "",
    name: "",
    carNumber: "",
    phoneNumber: "",
    arrivalStatus: ""
  });

  useEffect(() => {
    if (filterAppointmentNumber) {
      fetch(`http://localhost:5000/api/appointments/by-number/${filterAppointmentNumber}`)
        .then((res) => res.json())
        .then((data) => {
          const result = Array.isArray(data) ? data : [data];
          setAppointments(result);
        })
        .catch((err) => console.error("❌ שגיאה בשליפת תור לפי מזהה:", err));
    } else {
      fetchAppointments();
    }
  }, [filterAppointmentNumber]);

  const fetchAvailableTimes = async (date) => {
    if (!date) return;
    const res = await fetch(`http://localhost:5000/api/appointments/available-times/${date}`);
    const data = await res.json();
    setAvailableTimes(data);
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("❌ שגיאה בשליפת תורים:", error);
    }
  };

  const handleShowModal = (type, appointment = null) => {
    setModalType(type);

    if (type === "edit" && appointment) {
      setSelectedAppointment(appointment);
      setSelectedDate(appointment.date);
      fetchAvailableTimes(appointment.date);
    } else {
      setSearchTerm("");
    }
  };


  const handleCloseModal = () => {
    setModalType(null);
    setSelectedAppointment(null);
    setSearchTerm("");
  };

  const handleSave = async () => {
    try {
      if (modalType === "edit") {
        const res = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedAppointment),
        });
        const updated = await res.json();
        setAppointments((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
        alert("✅ התור עודכן בהצלחה!");
      }
    } catch (err) {
      console.error("❌ שגיאה בשמירה:", err);
      alert("❌ שגיאה בשמירה");
    }
    handleCloseModal();
  };


  const handleSearchById = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/by-id/${searchTerm}`);
      const data = await res.json();
      setAppointments(data);
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בחיפוש לפי תעודת זהות:", error);
    }
  };

  const handleSearchByDate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/by-date/${searchTerm}`);
      const data = await res.json();
      setAppointments(data);
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בחיפוש לפי תאריך:", error);
    }
  };

  const handleSearchByIdOrCar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/search/${searchTerm}`);
      const data = await res.json();
      setAppointments(data);
      handleCloseModal();
    } catch (error) {
      console.error("❌ שגיאה בחיפוש לפי ת\"ז או מספר רכב:", error);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את התור הזה?")) return;
  try {
    await fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: "DELETE",
    });
    alert("✅ התור נמחק בהצלחה!");
    setAppointments(prev => prev.filter(a => a._id !== id));
  } catch (error) {
    console.error("❌ שגיאה במחיקת תור:", error);
    alert("❌ שגיאה במחיקת תור");
  }
};


  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="me-3">תורים</h2>
      </div>

      <div className="d-flex mb-3">
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchID")}>
          חיפוש לפי ת"ז או מספר רישוי
        </button>
        <button className="btn btn-primary me-3" onClick={() => handleShowModal("searchDate")}>
          חיפוש לפי תאריך
        </button>
      </div>

     <div className="table-responsive" dir="rtl">
  <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>מזהה תור</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>תיאור</th>
              <th>ת"ז</th>
              <th>שם לקוח</th>
              <th>טלפון</th>
              <th>מספר רישוי</th>
              <th>סטטוס </th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.filter(a => a?.appointmentNumber).map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.appointmentNumber}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.description}</td>
                <td>{appointment.idNumber}</td>
                <td>{appointment.name}</td>
                <td>{appointment.phoneNumber || "—"}</td>
                <td>{appointment.carNumber}</td>
               
                <td>{appointment.arrivalStatus || "בהמתנה"}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/appointments/edit/${appointment._id}`, {
                        state: appointment
                      })
                    }
                  >
                    עריכה
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

      {modalType === "edit" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSave}>
          <h3>עריכת תור</h3>
          <form>
            {["date", "time", "description", "idNumber", "name", "carNumber", "phoneNumber"].map((field) => (
              <div className="form-group mb-3" key={field}>
                <label>{{
                  date: "תאריך",
                  time: "שעה",
                  description: "תיאור",
                  idNumber: "תעודת זהות",
                  name: "שם לקוח",
                  carNumber: "מספר רישוי",
                  phoneNumber: "טלפון"
                }[field]}</label>
                <input
                  type={field === "date" ? "date" : field === "time" ? "time" : "text"}
                  className="form-control"
                  value={selectedAppointment?.[field] || ""}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, [field]: e.target.value })}
                  required={field !== "phoneNumber"}
                />
              </div>
            ))}
          </form>
        </Modal>
      )}

      {modalType === "searchID" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearchByIdOrCar}>
          <h3>חיפוש לפי ת"ז או מספר רכב</h3>
          <input
            type="text"
            className="form-control"
            placeholder="חיפוש לפי ת'ז או מספר רכב"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // ✅ מסנן כל מה שהוא לא מספר
              setSearchTerm(value);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </Modal>
      )}


      {modalType === "searchDate" && (
        <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSearchByDate}>
          <h3>חיפוש לפי תאריך</h3>
          <input
            type="date"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Appointments;
