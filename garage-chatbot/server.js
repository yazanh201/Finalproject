import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // שימוש בקובץ .env לשמירת ה-API Key

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // עדכון למודל הנכון
        messages: [{ role: "user", content: message }],
        max_tokens: 150,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error connecting to OpenAI API" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
