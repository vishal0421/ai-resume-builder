import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateSummary = async (skills, experienceText) => {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Write professional resume summary.

Skills: ${skills}
Experience: ${experienceText}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Resume Builder"
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.log("ERROR DETAILS:", err.response?.data || err.message);
    throw err;
  }
};