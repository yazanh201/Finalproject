import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './cssfiles/InvoicePage.module.css';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';


const InvoicePage = () => {
  const downloadButtonRef = useRef(null);
  const { treatmentId } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isPaid, setIsPaid] = useState(false);



  const BASE_URL = "http://localhost:5000/uploads/";
  const BASE_API_URL = "http://localhost:5000/";

  useEffect(() => {
  const fetchData = async () => {
    try {
      const treatmentRes = await axios.get(`${BASE_API_URL}api/treatments/${treatmentId}`);
      const treatmentData = treatmentRes.data;

      // שליפת פרטי לקוח
      try {
        const customerRes = await axios.get(`${BASE_API_URL}api/customers/id-by-plate/${treatmentData.carPlate}`);
        treatmentData.idNumber = customerRes.data.idNumber;
        treatmentData.customerName = customerRes.data.name;
      } catch {}

      try {
        const emailRes = await axios.get(`${BASE_API_URL}api/customers/email-by-plate/${treatmentData.carPlate}`);
        treatmentData.email = emailRes.data.email;
      } catch {}

      setTreatment(treatmentData);

      // שליפת הזמנות פעילות
      try {
        const ordersRes = await axios.get(`${BASE_API_URL}api/carorders/active/${treatmentData.carPlate}`);
        const activeOrders = ordersRes.data;
        const orderPrices = {};
        activeOrders.forEach(order => {
          const key = `הזמנה-${order._id}`;
          orderPrices[key] = order.cost;
        });
        setOrders(activeOrders);
        setPrices(prev => ({ ...prev, ...orderPrices }));
      } catch {}

      // שליפת חשבונית קיימת
      const invoiceRes = await axios.get(`${BASE_API_URL}api/invoices/by-treatment/${treatmentId}`);
      if (invoiceRes.data) {
        setInvoiceExists(true);
        setIsPaid(invoiceRes.data.isPaid || false); // ✅ טוען את סטטוס התשלום

        // ✅ טעינת מחירים קיימים
        if (invoiceRes.data.items && invoiceRes.data.items.length > 0) {
          const loadedPrices = {};
          invoiceRes.data.items.forEach((item) => {
            const key = `${item.category}-${item.name}`;
            loadedPrices[key] = item.price;
          });
          setPrices(prev => ({ ...prev, ...loadedPrices }));
        }
      }

    } catch (err) {
      console.warn('❌ שגיאה בטעינת נתונים לחשבונית:', err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [treatmentId]);





 const handleSubmitInvoice = async () => {
  try {
    if (!treatment?._id) {
      toast.error("לא ניתן לשמור חשבונית – אין מזהה טיפול");
      return;
    }

    const items = [];

    // שירותים שבוצעו
    treatment.treatmentServices.forEach((serviceGroup) => {
      serviceGroup.selectedOptions.forEach((option) => {
        const key = `${serviceGroup.category}-${option}`;
        const price = prices[key] || 0;
        items.push({
          name: option,
          category: serviceGroup.category,
          price,
        });
      });
    });

    // הזמנות פעילות
    orders.forEach((order) => {
      const key = `הזמנה-${order._id}`;
      const price = prices[key] || 0;
      items.push({
        name: `הזמנה: ${order.details}`,
        category: 'הזמנות',
        price,
      });
    });

    const invoiceData = {
      treatmentId: treatment._id,
      items,
      isPaid, // ✅ שמירה של סטטוס התשלום
    };

    if (invoiceExists) {
      await axios.put(`${BASE_API_URL}api/invoices/${treatment._id}`, invoiceData);
      toast.success("החשבונית עודכנה בהצלחה");
    } else {
      await axios.post(`${BASE_API_URL}api/invoices`, invoiceData);
      toast.success("החשבונית נשמרה בהצלחה");
      setInvoiceExists(true);
    }
  } catch (err) {
    console.error("❌ שגיאה בשמירת/עדכון חשבונית:", err);
    toast.error("שגיאה בשמירת או עדכון החשבונית");
  }
};




  const total = Object.values(prices).reduce((sum, price) => sum + (price || 0), 0);
  const VAT_PERCENT = 17;
    const vatAmount = (total * VAT_PERCENT) / 100;
    const totalWithVAT = total + vatAmount;


  if (loading) return <p className={styles.loading}>טוען חשבונית...</p>;
  if (!treatment) return <p className={styles.error}>לא נמצאה חשבונית עבור טיפול זה.</p>;

  const dueDate = treatment?.date
    ? new Date(new Date(treatment.date).setMonth(new Date(treatment.date).getMonth() + 1))
    : null;


  const handleDownloadPdf = () => {
    const element = document.querySelector(`.${styles.invoiceContainer}`);

    // הסתר זמנית את כל האלמנטים שלא אמורים להיות ב־PDF
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'none');

    const opt = {
        margin: 0.5,
        filename: `invoice-${treatmentId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
        // החזרת האלמנטים לאחר ההורדה
        hiddenElements.forEach(el => el.style.display = 'block');
        });
    };


    const handleSendEmail = async () => {
  try {
    const element = document.getElementById('invoiceContent');

    // הסתרת כפתורים זמנית
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'none');

    // הגדרות PDF
    const opt = {
      margin: 0.5,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    const worker = html2pdf().set(opt).from(element);

    // יצירת ה־PDF כ־Blob
    const pdfBlob = await worker.outputPdf('blob');

    // יצירת FormData
    const formData = new FormData();
    formData.append('email', treatment.email);        // כתובת המייל
    formData.append('pdf', pdfBlob, 'invoice.pdf');   // הקובץ עצמו

    // שליחת המייל לשרת
    await axios.post(
      'http://localhost:5000/api/email/send-invoice',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    toast.success(' החשבונית נשלחה למייל בהצלחה!');
  } catch (err) {
    console.error(' שגיאה בשליחת מייל:', err);
    toast.error(' שגיאה בשליחת המייל');
  } finally {
    // החזרת כפתורים לאחר השליחה
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'block');
  }
};


const handleTogglePaid = async () => {
  try {
    await axios.put(`http://localhost:5000/api/invoices/${treatment._id}/status`, {
      isPaid: !isPaid
    });
    setIsPaid(!isPaid);
    toast.success(!isPaid ? "החשבונית סומנה כשולמה" : "החשבונית סומנה כלא שולמה");
  } catch (err) {
    toast.error("❌ שגיאה בעדכון סטטוס");
  }
};





  return (
    <div id="invoiceContent" className={styles.invoiceContainer}>
        <div className={styles.businessHeader}>
            <div>
                <img src="/img/invlogo.png" alt="לוגו מוסך" className={styles.logo} />
            </div>
            <div>
                <h3>מוסך שירות מהיר</h3>
                <p>רחוב התיקונים 5, חיפה</p>
                <p>טלפון : 03-5551234</p>
                <p> sherotmher12@gmail.com : אימייל</p>
            </div>
            </div>

        <h2 className={styles.invoiceTitle}>חשבונית טיפול</h2>

        <div className={styles.invoiceHeader}>
            <div>
            <p><strong>תאריך:</strong> {new Date(treatment.date).toLocaleDateString()}</p>
            <p><strong>מספר רכב:</strong> {treatment.carPlate}</p>
            </div>
            <div>
            <p><strong>לקוח:</strong> {treatment.customerName}</p>
            <p><strong>תעודת זהות:</strong> {treatment.idNumber || '—'}</p>
            </div>
        </div>

        <div className={styles.paymentStatus} style={{ marginTop: "20px" }}>
          <label style={{ fontWeight: "bold", marginLeft: "10px" }}>סטטוס תשלום:</label>
          <select
            className="form-select w-auto d-inline-block"
            value={isPaid ? "paid" : "unpaid"}
            onChange={(e) => setIsPaid(e.target.value === "paid")}
            style={{
              display: "inline-block",
              marginRight: "10px",
              borderColor: isPaid ? "green" : "red",
              color: isPaid ? "green" : "red",
              fontWeight: "bold"
            }}
          >
            <option value="unpaid">לא שולם</option>
            <option value="paid">שולם</option>
          </select>
        </div>


        <div className={styles.section}>
            <h4> שירותים שבוצעו</h4>
            {treatment.treatmentServices?.length > 0 ? (
            <table className={styles.servicesTable}>
                <thead>
                <tr>
                    <th>שירות</th>
                    <th>מחיר (₪)</th>
                </tr>
                </thead>
                <tbody>
                  {/* ✅ הצגת השירותים שבוצעו */}
                  {treatment.treatmentServices.map((group) =>
                    group.selectedOptions.map((option) => {
                      const key = `${group.category}-${option}`;
                      return (
                        <tr key={key}>
                          <td>{option}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={prices[key] || ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val < 0) return;
                                setPrices((prev) => ({
                                  ...prev,
                                  [key]: val,
                                }));
                              }}
                              className={styles.priceInput}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}

                  {/* ✅ הצגת ההזמנות הפעילות של הרכב */}
                  {orders.map((order) => {
                    const key = `הזמנה-${order._id}`;
                    return (
                      <tr key={key}>
                        <td>הזמנה: {order.details}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={prices[key] || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val < 0) return;
                              setPrices((prev) => ({
                                ...prev,
                                [key]: val,
                              }));
                            }}
                            className={styles.priceInput}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

            </table>
            ) : (
            <p>לא הוזנו שירותים</p>
            )}
        </div>

        <div className={styles.summary}>
            <p><strong>סה״כ לפני מע״מ:</strong> {total.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
            <p><strong>מע״מ (17%):</strong> {vatAmount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
            <p><strong>סה״כ כולל מע״מ:</strong> {totalWithVAT.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
        </div>
        {dueDate && (
            <div className={styles.dueDateNotice}>
                <p><strong>לתשומת לבך:</strong> יש לשלם את הסכום עד לתאריך: <u>{dueDate.toLocaleDateString('he-IL')}</u></p>
            </div>
            )}


        <div className="text-center mt-3 no-print">
            <button className="btn btn-success" onClick={handleSubmitInvoice}>
                {invoiceExists ? 'עדכן חשבונית' : 'שמור חשבונית'}
            </button>
            </div>

            {/* כפתור הורדת PDF */}
            <div className="text-center mt-3 no-print">
            <button
                className="btn btn-secondary"
                onClick={handleDownloadPdf}
                ref={downloadButtonRef}
            >
                הורד כ־PDF
            </button>
            </div>

            {/* כפתור שליחת מייל */}
            <div className="text-center mt-3 no-print">
            <button className="btn btn-primary mt-2" onClick={handleSendEmail}>
                שלח חשבונית במייל
            </button>
            </div>


            
            
        </div>
        
  );
};

export default InvoicePage;