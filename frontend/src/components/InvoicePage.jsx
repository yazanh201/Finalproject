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

  const BASE_URL = "http://localhost:5000/uploads/";
  const BASE_API_URL = "http://localhost:5000/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // שלב 1: טען את הטיפול
        const treatmentRes = await axios.get(`${BASE_API_URL}api/treatments/${treatmentId}`);
        const treatmentData = treatmentRes.data;

        // שלב 2: שלוף ת"ז ושם לפי מספר רכב
        try {
          const customerRes = await axios.get(`${BASE_API_URL}api/customers/id-by-plate/${treatmentData.carPlate}`);
          treatmentData.idNumber = customerRes.data.idNumber;
          treatmentData.customerName = customerRes.data.name;
        } catch (e) {
          console.warn("⚠️ לא נמצאה תעודת זהות לפי מספר רכב:", e.message);
        }

        // שלב 3: שלוף מייל לפי מספר רכב
        try {
          const emailRes = await axios.get(`${BASE_API_URL}api/customers/email-by-plate/${treatmentData.carPlate}`);
          treatmentData.email = emailRes.data.email;
        } catch (e) {
          console.warn("⚠️ לא נמצא אימייל לפי מספר רכב:", e.message);
        }

        setTreatment(treatmentData);

        // שלב 4: בדוק אם קיימת חשבונית
        const invoiceRes = await axios.get(`${BASE_API_URL}api/invoices/by-treatment/${treatmentId}`);
        if (invoiceRes.data && invoiceRes.data.items) {
          setInvoiceExists(true);
          const loadedPrices = {};
          invoiceRes.data.items.forEach((item, index) => {
            loadedPrices[index] = item.price;
          });
          setPrices(loadedPrices);
        }
      } catch (err) {
        console.warn('שגיאה בטעינה:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [treatmentId]);


 const handleSubmitInvoice = async () => {
  try {
    if (!treatment?._id) {
      console.error(" אין treatment._id – לא ניתן לשלוח חשבונית");
      toast.error(" לא ניתן לשלוח חשבונית – אין מזהה טיפול");
      return;
    }

    const items = [];
    let itemIndex = 0;

    treatment.treatmentServices.forEach((serviceGroup) => {
      serviceGroup.selectedOptions.forEach((option) => {
        const price = prices[itemIndex] || 0;
        items.push({
          name: option,
          category: serviceGroup.category,
          price,
        });
        itemIndex++;
      });
    });

    const invoiceData = {
      treatmentId: treatment._id,
      items,
    };

    if (invoiceExists) {
      await axios.put(`${BASE_API_URL}api/invoices/${treatment._id}`, invoiceData);
      toast.success(" החשבונית עודכנה בהצלחה");
    } else {
      await axios.post(`${BASE_API_URL}api/invoices`, invoiceData);
      toast.success(" החשבונית נשמרה בהצלחה");
      setInvoiceExists(true);
    }
  } catch (err) {
    console.error("❌ שגיאה בשמירת/עדכון חשבונית:", err);
    toast.error(" שגיאה בשמירת או עדכון החשבונית");
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
                {treatment.treatmentServices.map((group, groupIndex) =>
                    group.selectedOptions.map((option, optionIndex) => {
                    const key = groupIndex * 100 + optionIndex;
                    return (
                        <tr key={key}>
                        <td>{option}</td>
                        <td>
                            <input
                              type="number"
                              min="0"   // ✅ מונע הקלדת מספרים שליליים
                              value={prices[key] || ''}
                              onChange={(e) => {
                                  const val = Number(e.target.value);
                                  if (val < 0) return; // ✅ הגנה נוספת בקוד
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