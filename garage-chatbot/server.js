import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { GARAGE_INFO } from "./garageInfo.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// קבוצות מילות מפתח ותשובות חכמות
const keywordGroups = [
  // תורים וקביעת פגישות
  {
    keywords: ["תור", "קבע", "טיפול", "תיקון", "מועד", "פגישה", "מתי", "מתי אפשר"],
    response: `כדי לקבוע תור, יש מספר דרכים:
📞 התקשר אלינו: ${GARAGE_INFO.phone}
📧 שלח מייל: ${GARAGE_INFO.email}
🌐 היכנס לעמוד 'צור קשר' באתר
${GARAGE_INFO.appointmentRequired ? '⚠️ חשוב: יש לקבוע תור מראש' : '✅ אפשר להגיע גם ללא תור'}`
  },
  
  // מיקום וכתובת
  {
    keywords: ["איפה", "כתובת", "מיקום", "איך מגיעים", "איפה נמצא", "דרך", "כיוון"],
    response: `📍 המיקום שלנו:
${GARAGE_INFO.address}

🚗 חניה: ${GARAGE_INFO.parking}

🗺️ אפשר להגיע ברכב או בתחבורה ציבורית`
  },
  
  // יצירת קשר
  {
    keywords: ["טלפון", "פלאפון", "להתקשר", "צור קשר", "איך ליצור קשר", "מספר", "נייד"],
    response: `📞 יצירת קשר:
טלפון: ${GARAGE_INFO.phone}
אימייל: ${GARAGE_INFO.email}
כתובת: ${GARAGE_INFO.address}

💬 ${GARAGE_INFO.contactInstructions}`
  },
  
  // שעות פעילות
  {
    keywords: ["שעות", "פתיחה", "סגירה", "מתי פתוחים", "מתי סגורים", "שעות עבודה", "זמן"],
    response: `🕐 שעות פעילות:
${GARAGE_INFO.hours}

❌ סגור: ${GARAGE_INFO.closedDays}

🌍 שפות: ${GARAGE_INFO.languages.join(', ')}`
  },
  
  // מחירים ועלויות
  {
    keywords: ["מחיר", "עולה", "עלות", "כמה עולה", "תמחור", "סכום", "תשלום"],
    response: `💰 מחירים:
המחירים משתנים לפי סוג הרכב והתקלה.

💳 אמצעי תשלום: ${GARAGE_INFO.paymentMethods.join(', ')}

📋 הצעות מחיר סופיות ניתנות לאחר בדיקת הרכב בלבד.

💡 לקוחות קבועים זכאים להנחות על טיפולים שוטפים.`
  },
  
  // שירותים
  {
    keywords: ["שירותים", "מה אתם עושים", "איזה שירותים", "טיפולים", "תיקונים"],
    response: `🔧 השירותים שלנו:
${GARAGE_INFO.services.map(service => 
  `• ${service.name}: ${service.description}
  💰 ${service.averagePrice} | ⏱️ ${service.estimatedTime}`
).join('\n')}

🚗 רכבים נתמכים: ${GARAGE_INFO.supportedVehicles.join(', ')}`
  },
  
  // אחריות
  {
    keywords: ["אחריות", "גרונטי", "warranty", "אחריות על", "תקופת אחריות"],
    response: `🛡️ מדיניות אחריות:
${GARAGE_INFO.warrantyPolicy}

✅ כל התיקונים שלנו מגובים באחריות מלאה`
  },
  
  // חניה
  {
    keywords: ["חניה", "חנייה", "איפה לחנות", "חניון", "חנייה חינם"],
    response: `🅿️ חניה:
${GARAGE_INFO.parking}

📍 המיקום: ${GARAGE_INFO.address}`
  },
  
  // שפות
  {
    keywords: ["שפות", "עברית", "אנגלית", "ערבית", "איזה שפה", "תקשורת"],
    response: `🌍 שפות שירות:
${GARAGE_INFO.languages.join(', ')}

💬 הצוות שלנו דובר את כל השפות הללו ברמה מקצועית`
  },
  
  // רכבים נתמכים
  {
    keywords: ["איזה רכבים", "רכבים נתמכים", "סוגי רכבים", "מטפלים ב", "רכב פרטי", "מסחרי"],
    response: `🚗 רכבים נתמכים:
${GARAGE_INFO.supportedVehicles.join(', ')}

🔧 אנחנו מטפלים בכל סוגי הרכבים הללו עם צוות מקצועי וציוד מתקדם`
  },
  
  // אמצעי תשלום
  {
    keywords: ["איך לשלם", "אמצעי תשלום", "כרטיס", "מזומן", "העברה", "תשלום"],
    response: `💳 אמצעי תשלום:
${GARAGE_INFO.paymentMethods.join(', ')}

✅ כל התשלומים מאובטחים ומעוגנים בחוק`
  },
  
  // שבת וסגירה
  {
    keywords: ["שבת", "פתוחים בשבת", "סגורים בשבת", "יום שבת", "סוף שבוע"],
    response: `📅 שבת:
${GARAGE_INFO.closedDays === "שבת" ? "❌ סגור בשבת" : "✅ פתוח בשבת"}

🕐 שעות פעילות רגילות:
${GARAGE_INFO.hours}`
  },
  
  // שירותי חירום
  {
    keywords: ["חירום", "גרירה", "שירות דרכים", "תקלה בדרך", "עזרה בדרך", "נקלעתי"],
    response: `🚨 שירותי חירום:
${GARAGE_INFO.emergencyServices.map(service => 
  `• ${service.name}: ${service.description}
  📞 ${service.phone} | ⏰ ${service.availability} | 💰 ${service.price}`
).join('\n')}

🆘 במקרה חירום - התקשר מיד!`
  },
  
  // שאלות נפוצות
  {
    keywords: ["שאלות נפוצות", "faq", "שאלות", "תשובות", "מידע כללי"],
    response: `❓ שאלות נפוצות:
${GARAGE_INFO.faq.map(qa => 
  `Q: ${qa.question}
A: ${qa.answer}`
).join('\n\n')}`
  },
  
  // טיפים לתחזוקה
  {
    keywords: ["טיפים", "תחזוקה", "איך לתחזק", "טיפים לרכב", "תחזוקה שוטפת"],
    response: `💡 טיפים לתחזוקה שוטפת:
${GARAGE_INFO.maintenanceTips.map(tip => `• ${tip}`).join('\n')}

🔧 מומלץ לבצע טיפול שוטף כל 10,000-15,000 ק״מ`
  },
  
  // סימני אזהרה
  {
    keywords: ["סימני אזהרה", "נורה אדומה", "רעשים", "ריח שריפה", "בעיות", "תקלות"],
    response: `⚠️ סימני אזהרה - מה לעשות:
${GARAGE_INFO.warningSigns.map(warning => 
  `🚨 ${warning.sign}
   → ${warning.action}`
).join('\n\n')}

🆘 במקרה של ספק - פנה למוסך לבדיקה מקצועית!`
  },
  
  // מידע על המוסך
  {
    keywords: ["על המוסך", "מידע", "הסטוריה", "צוות", "ציוד", "הסמכות"],
    response: `🏢 על המוסך ${GARAGE_INFO.name}:
📅 נוסד: ${GARAGE_INFO.additionalInfo.established}
👥 צוות: ${GARAGE_INFO.additionalInfo.teamSize}
🏆 הסמכות: ${GARAGE_INFO.additionalInfo.certifications.join(', ')}
🔧 ציוד: ${GARAGE_INFO.additionalInfo.equipment.join(', ')}
🚗 התמחויות: ${GARAGE_INFO.additionalInfo.specialties.join(', ')}
🛡️ ביטוח: ${GARAGE_INFO.additionalInfo.insurance}
🌱 איכות סביבה: ${GARAGE_INFO.additionalInfo.environmental}`
  },
  
  // הערות כלליות
  {
    keywords: ["מידע נוסף", "הערות", "חשוב לדעת", "טיפים", "המלצות"],
    response: `ℹ️ מידע חשוב:
${GARAGE_INFO.generalNotes.join('\n')}

💡 טיפים נוספים:
• מומלץ להביא את ספר הרכב
• יש אינטרנט אלחוטי חינם במקום
• ניתן להמתין במקום בזמן הטיפול`
  }
];

// פונקציה לחיפוש מידע ספציפי
function findSpecificInfo(message) {
  const lowerMessage = message.toLowerCase();
  
  // חיפוש שירותים ספציפיים
  for (const service of GARAGE_INFO.services) {
    if (lowerMessage.includes(service.name.toLowerCase()) || 
        lowerMessage.includes(service.description.toLowerCase())) {
      return `🔧 ${service.name}:
📝 ${service.description}
💰 מחיר ממוצע: ${service.averagePrice}
⏱️ זמן משוער: ${service.estimatedTime}
🔄 תדירות מומלצת: ${service.frequency}`;
    }
  }
  
  // חיפוש שירותי חירום
  for (const emergency of GARAGE_INFO.emergencyServices) {
    if (lowerMessage.includes(emergency.name.toLowerCase())) {
      return `🚨 ${emergency.name}:
📝 ${emergency.description}
📞 טלפון: ${emergency.phone}
⏰ זמינות: ${emergency.availability}
💰 מחיר: ${emergency.price}`;
    }
  }
  
  // חיפוש שאלות נפוצות
  for (const qa of GARAGE_INFO.faq) {
    if (lowerMessage.includes(qa.question.toLowerCase().replace('?', '').replace('האם', ''))) {
      return `❓ ${qa.question}
✅ ${qa.answer}`;
    }
  }
  
  return null;
}

// פונקציה לחיפוש תשובה לפי מילות מפתח
function getMatchedResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // חיפוש מידע ספציפי קודם
  const specificInfo = findSpecificInfo(message);
  if (specificInfo) {
    return specificInfo;
  }
  
  // חיפוש לפי קבוצות מילות מפתח
  for (const group of keywordGroups) {
    if (group.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return group.response;
    }
  }
  
  return null;
}

// יצירת system prompt עשיר
function createSystemPrompt() {
  return `אתה עוזר חכם במוסך "${GARAGE_INFO.name}". אתה עונה רק על שאלות שקשורות לרכב, מוסך, טיפולים, תקלות מכניות, תורים ושירותי מוסך.

📋 מידע על המוסך:
🏢 שם: ${GARAGE_INFO.name}
📍 כתובת: ${GARAGE_INFO.address}
📞 טלפון: ${GARAGE_INFO.phone}
📧 אימייל: ${GARAGE_INFO.email}
🕐 שעות: ${GARAGE_INFO.hours}
❌ סגור: ${GARAGE_INFO.closedDays}

🔧 השירותים שלנו:
${GARAGE_INFO.services.map(service => 
  `• ${service.name}: ${service.description} (${service.averagePrice}, ${service.estimatedTime})`
).join('\n')}

🚗 רכבים נתמכים: ${GARAGE_INFO.supportedVehicles.join(', ')}
💳 אמצעי תשלום: ${GARAGE_INFO.paymentMethods.join(', ')}
🌍 שפות: ${GARAGE_INFO.languages.join(', ')}
🅿️ חניה: ${GARAGE_INFO.parking}
🛡️ אחריות: ${GARAGE_INFO.warrantyPolicy}

🚨 שירותי חירום:
${GARAGE_INFO.emergencyServices.map(service => 
  `• ${service.name}: ${service.description} (${service.phone}, ${service.availability})`
).join('\n')}

❓ שאלות נפוצות:
${GARAGE_INFO.faq.map(qa => `Q: ${qa.question} | A: ${qa.answer}`).join('\n')}

💡 טיפים לתחזוקה:
${GARAGE_INFO.maintenanceTips.join('\n')}

⚠️ סימני אזהרה:
${GARAGE_INFO.warningSigns.map(warning => `${warning.sign} → ${warning.action}`).join('\n')}

💡 הערות חשובות:
${GARAGE_INFO.generalNotes.join('\n')}

📝 הנחיות:
• ענה בצורה ידידותית ומקצועית
• השתמש באימוג'ים להדגשה
• תן תשובות מדויקות ומפורטות
• אם אין לך מידע - הפנה ליצירת קשר
• אם שואלים משהו לא קשור - תגיד "מצטער, אני יכול לעזור רק בנושאים הקשורים למוסך ורכב"
• תמיד תציע דרכי יצירת קשר נוספות
• תן טיפים מעשיים כשאפשר
• הזכר את שעות הפעילות ואמצעי התשלום`;
}

// נקודת קצה לצ'אט
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // בדיקה אם השאלה מתאימה לתגובה קבועה
    const predefinedResponse = getMatchedResponse(message);
    if (predefinedResponse) {
      return res.json({ response: predefinedResponse });
    }

    // אם אין התאמה, שליחה ל-GPT עם מידע עשיר
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: createSystemPrompt()
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 400,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ שגיאה בצ'אט:", error?.response?.data || error.message);
    
    // תשובת ברירת מחדל במקרה של שגיאה
    const fallbackResponse = `מצטער, יש בעיה זמנית במערכת. 
    
📞 אנא צור קשר ישירות:
טלפון: ${GARAGE_INFO.phone}
אימייל: ${GARAGE_INFO.email}

🔧 או היכנס לעמוד 'צור קשר' באתר.`;
    
    res.json({ response: fallbackResponse });
  }
});

// נקודת קצה למידע על המוסך
app.get("/garage-info", (req, res) => {
  res.json(GARAGE_INFO);
});

// נקודת קצה לבדיקת בריאות השרת
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    garage: GARAGE_INFO.name 
  });
});

// הפעלת השרת
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏢 Garage: ${GARAGE_INFO.name}`);
  console.log(`📍 Address: ${GARAGE_INFO.address}`);
  console.log(`📞 Phone: ${GARAGE_INFO.phone}`);
  console.log(`🔧 Services: ${GARAGE_INFO.services.length} services available`);
  console.log(`❓ FAQ: ${GARAGE_INFO.faq.length} questions ready`);
});
