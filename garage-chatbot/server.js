import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// קבוצות מילות מפתח ותשובות קבועות
const keywordGroups = [
  {
    keywords: ["תור", "קבע", "טיפול", "תיקון", "מועד"],
    response: "כדי לקבוע תור, היכנס לעמוד 'צור קשר' באתר או התקשר ל־050-1234567."
  },
  {
    keywords: ["איפה", "כתובת", "מיקום"],
    response: "המוסך שלנו נמצא ברחוב הברזל 10, תל אביב."
  },
  {
    keywords: ["טלפון", "פלאפון", "להתקשר"],
    response: "אפשר ליצור קשר בטלפון 050-1234567."
  },
  {
    keywords: ["שעות", "פתיחה", "סגירה", "מתי פתוחים"],
    response: "אנחנו פתוחים בימים א׳–ה׳ בין 08:00–17:00, וביום ו׳ בין 08:00–13:00."
  },
  {
    keywords: ["מחיר", "עולה", "עלות"],
    response: "המחיר משתנה לפי סוג הרכב והתקלה. נשמח לתת הצעת מחיר בטלפון או בעמוד צור קשר."
  },
  {
    keywords: ["שבת", "פתוחים בשבת"],
    response: "אנחנו סגורים בשבת. זמינים בימים א׳ עד ו׳."
  }
];

// פונקציית התאמה לפי קבוצות מילים
function getMatchedResponse(message) {
  const lowerMessage = message.toLowerCase();
  for (const group of keywordGroups) {
    if (group.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return group.response;
    }
  }
  return null;
}

// נקודת קצה לצ'אט
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // בדיקה אם השאלה מתאימה לתגובה קבועה
  const predefinedResponse = getMatchedResponse(message);
  if (predefinedResponse) {
    return res.json({ response: predefinedResponse });
  }

  // אם אין התאמה, שליחה ל-GPT
  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `אתה עוזר חכם במוסך. אתה עונה רק על שאלות שקשורות לרכב, מוסך, טיפולים, תקלות מכניות, תורים ושירותי מוסך.
אם שואלים אותך משהו שלא קשור – תגיד "מצטער, אני יכול לעזור רק בנושאים הקשורים למוסך ורכב."`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Error connecting to OpenAI API" });
  }
});

// הפעלת השרת
const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
