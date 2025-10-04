import axios from "axios";
import { GeminiTask } from "@/constants/types";

const GEMINI_API_KEY = "AIzaSyAnpya1oO7QtSp5OhccqzhNKLRJu0pvDYs";
const GEMINI_URL =   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function getStringResponse(prompt: string): Promise<string> {
    const contents = [{ role: "user", parts: [{ text: prompt }] }];

    try {
        const { data } = await axios.post(
            GEMINI_URL,
            { contents },
            {
                params: { key: GEMINI_API_KEY },
                headers: { "Content-Type": "application/json" },
            }
        );
        return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (error) {
        console.error("Error fetching string response from Gemini:", error);
        return "";
    }
}

export async function getJsonResponse(prompt: string): Promise<GeminiTask | null> {
    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    let retries = 3;

    while (retries > 0) {
        try {
            const { data } = await axios.post(
                GEMINI_URL,
                { contents },
                {
                    params: { key: GEMINI_API_KEY },
                    headers: { "Content-Type": "application/json" },
                }
            );

            const rawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawResponse) {
                console.warn(`Attempt ${4 - retries}: Gemini returned an empty response. Retrying.`);
                retries--;
                continue;
            }

            const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
            const parsedJson = JSON.parse(cleanedResponse);
            
            if (parsedJson.operation && parsedJson.name && parsedJson.date_type) {
                return parsedJson as GeminiTask;
            } else {
                console.warn(`Attempt ${4 - retries}: Validation failed for response: ${cleanedResponse}. Retrying.`);
                retries--;
            }

        } catch (error) {
            console.error(`Attempt ${4 - retries}: Error parsing or fetching Gemini JSON response.`, error);
            retries--;
        }
    }
    
    console.error("Failed to get a valid JSON response from Gemini after 3 attempts.");
    return null; 
}

export async function parseTaskOperation(text: string): Promise<GeminiTask | null> {
    const mockPrompt = `Hello word ${text}`;
    return getJsonResponse(mockPrompt);
}

export async function pickNextTask(): Promise<GeminiTask | null> {
    const mockPrompt = `Hello word`;
    return getJsonResponse(mockPrompt);
}
