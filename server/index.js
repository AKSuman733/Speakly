import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/correct", async (req, res) => {
  try {
    const { sentence } = req.body;

    const prompt = `
You are a friendly English tutor for beginners (especially Indian users).

Your job:
1. Correct the user's sentence
2. Explain the mistake in simple Hinglish (Hindi + English mix)
3. Suggest your natural response as per users sentence 
4. Add a short, funny or relatable line based on the user's sentence

Tone:
- Be friendly, cool, and a little funny
- Use Hinglish for explanation
- Keep explanation short (1–2 lines max)
- Humor should be light, not offensive

User sentence: "${sentence}"

Return JSON:
{
  "corrected": "...",
  "explanation": "...",
  "myResponce": "...",
  "followUpQuestion": "..."
}
Return ONLY valid JSON.
Do not use backticks.
Do not add markdown.
Do not add explanations outside JSON.

Rules for explanation:
- Use simple Hinglish (example: "yahan 'went' nahi, 'go' aayega")
- Avoid difficult English words
- Make it relatable and easy
- Ask followUpQuestions only in english

Rules for fun_line:
- Keep it short (1 line)
- Make it relatable or funny
- Can tease lightly but never insult
- Match the context of the sentence
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      
    });
     
    const text = response.choices[0].message.content;
     
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});