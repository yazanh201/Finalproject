import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddCustomerWithCar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    phonePrefix: "050",
    phoneNumber: "",
    email: "",
    vehicleNumber: "", // ✅ מספר רכב
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ אימותים
    if (name === "idNumber" && !/^\d{0,9}$/.test(value)) return;
    if (name === "name" && !/^[א-תa-zA-Z\s]*$/.test(value)) return;
    if (name === "phoneNumber" && !/^\d{0,7}$/.test(value)) return;
    if (name === "vehicleNumber" && !/^\d{0,9}$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.trim().length < 2) return toast.error("שם לקוח אינו תקין");
    if (form.idNumber.length !== 9) return toast.error("תעודת זהות חייבת להכיל בדיוק 9 ספרות");
    if (form.phoneNumber.length !== 7) return toast.error("מספר טלפון חייב להכיל 7 ספרות");
    if (form.vehicleNumber.length < 5) return toast.error("מספר רכב חייב להכיל לפחות 5 ספרות");

    try {
      const payload = {
        name: form.name,
        idNumber: form.idNumber,
        phone: form.phonePrefix + form.phoneNumber,
        email: form.email,
        vehicleNumber: form.vehicleNumber,
      };

      await axios.post("http://localhost:5000/api/customers", payload);

      toast.success("הלקוח נשמר בהצלחה!");
        navigate(`/complete-vehicle/${form.vehicleNumber}`);
        } catch (error) {
          console.error("שגיאה:", error);
          const msg = error.response?.data?.message || "ארעה שגיאה בהוספה. ודא שכל הנתונים תקינים.";
          toast.error(msg);
        }

  };

  return (
    <div className="container mt-4" dir="rtl">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">הוספת לקוח ורכב</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">שם לקוח מלא</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">תעודת זהות</label>
              <input
                type="text"
                name="idNumber"
                className="form-control"
                value={form.idNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">מספר טלפון</label>
              <div className="d-flex">
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control ms-2"
                  placeholder="7 ספרות"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <select
                  name="phonePrefix"
                  className="form-select w-auto"
                  value={form.phonePrefix}
                  onChange={handleChange}
                >
                  {["050", "052", "053", "054", "055", "056", "057", "058", "059"].map((prefix) => (
                    <option key={prefix} value={prefix}>{prefix}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">מייל</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">מספר רישוי רכב</label>
              <input
                type="text"
                name="vehicleNumber"
                className="form-control"
                value={form.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-primary px-5">
                שמירה
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerWithCar;
