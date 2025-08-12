// InvoicePage – קומפוננטת חשבונית המציגה נתוני טיפול, פריטים, מחירים, וכוללת יצוא PDF ושליחת מייל

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './cssfiles/InvoicePage.module.css';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaDownload, FaEnvelope, FaSave, FaEdit } from 'react-icons/fa';

const InvoicePage = () => {
  // רפרנס לכפתור הורדה (לשימוש עתידי)
  const downloadButtonRef = useRef(null);

  // ID של הטיפול מה־URL
  const { treatmentId } = useParams();

  // סטייטים לשמירת מידע חשוב
  const [treatment, setTreatment] = useState(null); // נתוני טיפול
  const [loading, setLoading] = useState(true); // סטטוס טעינה
  const [prices, setPrices] = useState({}); // מילון של מחירים לכל פריט
  const [invoiceExists, setInvoiceExists] = useState(false); // האם קיימת חשבונית
  const [orders, setOrders] = useState([]); // הזמנות פעילות
  const [isPaid, setIsPaid] = useState(false); // סטטוס תשלום
  const [customItems, setCustomItems] = useState([]); // פריטים מותאמים אישית

  // נתיבי API
  const BASE_URL = "https://garage-backend-o8do.onrender.com/uploads/";
  const BASE_API_URL = "https://garage-backend-o8do.onrender.com/";

  // טוען את כל הנתונים בעת טעינת הקומפוננטה
  useEffect(() => {
    const fetchData = async () => {
      try {
        // שליפת נתוני טיפול
        const treatmentRes = await axios.get(`${BASE_API_URL}api/treatments/${treatmentId}`);
        const treatmentData = treatmentRes.data;

        // שליפת פרטי לקוח לפי מספר רכב
        try {
          const customerRes = await axios.get(`${BASE_API_URL}api/customers/id-by-plate/${treatmentData.carPlate}`);
          treatmentData.idNumber = customerRes.data.idNumber;
          treatmentData.customerName = customerRes.data.name;
        } catch {}

        // שליפת אימייל של הלקוח
        try {
          const emailRes = await axios.get(`${BASE_API_URL}api/customers/email-by-plate/${treatmentData.carPlate}`);
          treatmentData.email = emailRes.data.email;
        } catch {}

        setTreatment(treatmentData);

        // שליפת הזמנות פעילות לרכב
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

        // טעינת חשבונית קיימת אם קיימת
        const invoiceRes = await axios.get(`${BASE_API_URL}api/invoices/by-treatment/${treatmentId}`);
        if (invoiceRes.data) {
          setInvoiceExists(true);
          setIsPaid(invoiceRes.data.isPaid || false); // סטטוס תשלום

          // טעינת מחירים קיימים מהחשבונית
          if (invoiceRes.data.items && invoiceRes.data.items.length > 0) {
            const loadedPrices = {};
            const customItemsFromInvoice = [];
            
            invoiceRes.data.items.forEach((item) => {
              if (item.category === 'פריט מותאם אישית') {
                customItemsFromInvoice.push({
                  id: item._id || Math.random().toString(),
                  name: item.name,
                  price: item.price
                });
              } else {
                const key = `${item.category}-${item.name}`;
                loadedPrices[key] = item.price;
              }
            });
            
            setPrices(prev => ({ ...prev, ...loadedPrices }));
            setCustomItems(customItemsFromInvoice);
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

  // פונקציה להוספת פריט מותאם אישית
  const addCustomItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      price: 0
    };
    setCustomItems([...customItems, newItem]);
  };

  // פונקציה לעדכון פריט מותאם אישית
  const updateCustomItem = (id, field, value) => {
    setCustomItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // פונקציה למחיקת פריט מותאם אישית
  const removeCustomItem = (id) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  // ⬇ פונקציה לשמירת/עדכון החשבונית במסד הנתונים
  const handleSubmitInvoice = async () => {
    try {
      if (!treatment?._id) {
        toast.error("לא ניתן לשמור חשבונית – אין מזהה טיפול");
        return;
      }

      const items = [];

      // מעבר על שירותים שבוצעו והוספתם לרשימת פריטים
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

      // הוספת הזמנות פעילות לרשימת הפריטים
      orders.forEach((order) => {
        const key = `הזמנה-${order._id}`;
        const price = prices[key] || 0;
        items.push({
          name: `הזמנה: ${order.details}`,
          category: 'הזמנות',
          price,
        });
      });

      // הוספת פריטים מותאמים אישית
      customItems.forEach((item) => {
        if (item.name.trim() && item.price > 0) {
          items.push({
            name: item.name,
            category: 'פריט מותאם אישית',
            price: item.price,
          });
        }
      });

      // יצירת גוף החשבונית
      const invoiceData = {
        treatmentId: treatment._id,
        items,
        isPaid, // האם שולם
      };

      // שליחה לשרת – POST אם לא קיים, PUT אם כן
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

  // חישוב סה"כ ומע"מ
  const total = Object.values(prices).reduce((sum, price) => sum + (price || 0), 0) + 
                customItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const VAT_PERCENT = 17;
  const vatAmount = (total * VAT_PERCENT) / 100;
  const totalWithVAT = total + vatAmount;

  // מציג הודעות במצב טעינה או שגיאה
  if (loading) return <p className={styles.loading}>טוען חשבונית...</p>;
  if (!treatment) return <p className={styles.error}>לא נמצאה חשבונית עבור טיפול זה.</p>;

  // תאריך פירעון – חודש קדימה מתאריך הטיפול
  const dueDate = treatment?.date
    ? new Date(new Date(treatment.date).setMonth(new Date(treatment.date).getMonth() + 1))
    : null;

  // הורדת החשבונית כ־PDF
  const handleDownloadPdf = () => {
    const element = document.querySelector(`.${styles.invoiceContainer}`);
    const paymentStatus = document.getElementById('paymentStatusSection');

    // הסתרה זמנית של סטטוס תשלום וכפתורים
    if (paymentStatus) paymentStatus.style.display = 'none';
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'none');

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2], // מרווחים קטנים מאוד
      filename: `invoice-${treatmentId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.2, // קנה מידה קטן יותר
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff' // רקע לבן
      },
      jsPDF: { 
        unit: 'cm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: 'avoid-all' } // מניעת שבירת דפים
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // החזרת אלמנטים שהוסתרו
        if (paymentStatus) paymentStatus.style.display = 'block';
        hiddenElements.forEach(el => el.style.display = 'block');
      });
  };

  // שליחת החשבונית למייל הלקוח
  const handleSendEmail = async () => {
    try {
      const element = document.getElementById('invoiceContent');
      const paymentStatus = document.getElementById('paymentStatusSection');

      // הסתרת פרטים זמנית
      if (paymentStatus) paymentStatus.style.display = 'none';
      const hiddenElements = document.querySelectorAll('.no-print');
      hiddenElements.forEach(el => el.style.display = 'none');

      const opt = {
        margin: [0.2, 0.2, 0.2, 0.2], // מרווחים קטנים מאוד
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.2, // קנה מידה קטן יותר
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff' // רקע לבן
        },
        jsPDF: { 
          unit: 'cm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: 'avoid-all' } // מניעת שבירת דפים
      };

      // יצירת Blob של PDF ושליחתו למייל דרך API
      const worker = html2pdf().set(opt).from(element);
      const pdfBlob = await worker.outputPdf('blob');

      const formData = new FormData();
      formData.append('email', treatment.email);
      formData.append('pdf', pdfBlob, 'invoice.pdf');

      await axios.post(
        'http://localhost:5000/api/email/send-invoice',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.success('החשבונית נשלחה למייל בהצלחה!');
    } catch (err) {
      console.error('שגיאה בשליחת מייל:', err);
      toast.error('שגיאה בשליחת המייל');
    } finally {
      // החזרת האלמנטים שהוסתרו
      const paymentStatus = document.getElementById('paymentStatusSection');
      if (paymentStatus) paymentStatus.style.display = 'block';
      const hiddenElements = document.querySelectorAll('.no-print');
      hiddenElements.forEach(el => el.style.display = 'block');
    }
  };

  return (
    <div id="invoiceContent" className={styles.invoiceContainer}>
      {/* כותרת עסק */}
      <div className={styles.businessHeader}>
        <div className={styles.logoSection}>
          <img src="/img/invlogo.png" alt="לוגו מוסך" className={styles.logo} />
        </div>
        <div className={styles.businessInfo}>
          <h3>מוסך שירות מהיר</h3>
          <p>רחוב התיקונים 5, חיפה</p>
          <p>טלפון: 03-5551234</p>
          <p>אימייל: sherotmher12@gmail.com</p>
        </div>
        <div className={styles.invoiceMeta}>
          <h2 className={styles.invoiceTitle}>חשבונית טיפול</h2>
          <p className={styles.invoiceDate}>תאריך: {new Date().toLocaleDateString('he-IL')}</p>
        </div>
      </div>

      {/* פרטי לקוח */}
      <div className={styles.customerDetails}>
        <h4>פרטי לקוח</h4>
        <div className={styles.customerGrid}>
          <div className={styles.customerField}>
            <label>שם הלקוח:</label>
            <span>{treatment.customerName || 'לא זמין'}</span>
          </div>
          <div className={styles.customerField}>
            <label>תעודת זהות:</label>
            <span>{treatment.idNumber || 'לא זמין'}</span>
          </div>
          <div className={styles.customerField}>
            <label>מספר רכב:</label>
            <span>{treatment.carPlate}</span>
          </div>
          <div className={styles.customerField}>
            <label>אימייל:</label>
            <span>{treatment.email || 'לא זמין'}</span>
          </div>
        </div>
      </div>

      {/* סטטוס תשלום */}
      <div id="paymentStatusSection" className={styles.paymentStatus}>
        <label>סטטוס תשלום:</label>
        <select
          value={isPaid ? "paid" : "unpaid"}
          onChange={(e) => setIsPaid(e.target.value === "paid")}
          className={styles.paymentSelect}
        >
          <option value="unpaid">לא שולם</option>
          <option value="paid">שולם</option>
        </select>
        <div className={styles.paymentIndicator}>
          {isPaid ? '✅ שולם' : '❌ לא שולם'}
        </div>
      </div>

      {/* טבלת פריטים */}
      <div className={styles.itemsSection}>
        <div className={styles.sectionHeader}>
          <h4>פריטים ושירותים</h4>
          <button 
            className={`${styles.addItemBtn} no-print`}
            onClick={addCustomItem}
            type="button"
          >
            <FaPlus /> הוסף פריט
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th className={styles.descriptionColumn}>תיאור</th>
                <th className={styles.priceColumn}>מחיר (₪)</th>
                <th className={`${styles.actionsColumn} no-print`}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {/* שירותים שבוצעו */}
              {treatment.treatmentServices?.map((group) =>
                group.selectedOptions.map((option) => {
                  const key = `${group.category}-${option}`;
                  return (
                    <tr key={key} className={styles.serviceRow}>
                      <td className={styles.descriptionColumn}>{option}</td>
                      <td className={styles.priceColumn}>
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
                      <td className={`${styles.actionsColumn} no-print`}></td>
                    </tr>
                  );
                })
              )}

              {/* הזמנות פעילות */}
              {orders.map((order) => {
                const key = `הזמנה-${order._id}`;
                return (
                  <tr key={key} className={styles.orderRow}>
                    <td className={styles.descriptionColumn}>הזמנה: {order.details}</td>
                    <td className={styles.priceColumn}>
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
                    <td className={`${styles.actionsColumn} no-print`}></td>
                  </tr>
                );
              })}

              {/* פריטים מותאמים אישית */}
              {customItems.map((item) => (
                <tr key={item.id} className={styles.customRow}>
                  <td className={styles.descriptionColumn}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateCustomItem(item.id, 'name', e.target.value)}
                      placeholder="תיאור הפריט"
                      className={styles.itemNameInput}
                    />
                  </td>
                  <td className={styles.priceColumn}>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateCustomItem(item.id, 'price', Number(e.target.value))}
                      className={styles.priceInput}
                    />
                  </td>
                  <td className={`${styles.actionsColumn} no-print`}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeCustomItem(item.id)}
                      type="button"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* סיכום תשלום */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>סה״כ לפני מע״מ:</span>
          <span>{total.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>מע״מ (17%):</span>
          <span>{vatAmount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</span>
        </div>
        <div className={styles.summaryRow + ' ' + styles.totalRow}>
          <span>סה״כ כולל מע״מ:</span>
          <span>{totalWithVAT.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</span>
        </div>
      </div>

      {/* הודעה על תאריך פירעון */}
      {dueDate && (
        <div className={styles.dueDateNotice}>
          <p>
            <strong>לתשומת לבך:</strong> יש לשלם את הסכום עד לתאריך: 
            <u>{dueDate.toLocaleDateString('he-IL')}</u>
          </p>
        </div>
      )}

      {/* כפתורי פעולה */}
      <div className={`${styles.actionButtons} no-print`}>
        <button className={styles.saveBtn} onClick={handleSubmitInvoice}>
          <FaSave />
          {invoiceExists ? 'עדכן חשבונית' : 'שמור חשבונית'}
        </button>
        
        <button className={styles.downloadBtn} onClick={handleDownloadPdf}>
          <FaDownload />
          הורד PDF
        </button>
        
        <button className={styles.emailBtn} onClick={handleSendEmail}>
          <FaEnvelope />
          שלח במייל
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;