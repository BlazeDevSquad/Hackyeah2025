import axios from "axios";

const GEMINI_API_KEY = "AIzaSyAnpya1oO7QtSp5OhccqzhNKLRJu0pvDYs"; // 🔒 tylko na hackathonie, potem przez backend!

export async function callGemini(prompt: string) {
    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const body = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    const { data } = await axios.post(url, body, {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
    });

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "(brak odpowiedzi)";
}