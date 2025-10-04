import axios from "axios";
import { GeminiTask, Task } from "@/constants/types";

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

export async function parseTaskOperation(text: string, tasks: Task[]): Promise<GeminiTask | null> {
    const mockPrompt = `
You are a task extraction assistant.
Your job is to read the user's input about tasks and generate list of JSON objects following the Task interface.

You will be provided with:

A list of existing tasks (with their fields filled).

The current date.

The user's input text, wjhich can contain more than one task.

Rules:

OPERATION:

If the user explicitly says they want to add something new → "Add".

If they mention changing/updating an existing task → "Modify".

If unclear, infer the most likely option and choose "Add" or "Modify".

name:

Extract the task description from the user input.

You may rephrase it into a clearer, prettier task name if needed.

date_type and date:

If the task must be finished before a time limit or has a due timeframe (e.g., “by tomorrow,” “before Friday,” “in 2 days”, "till the end of the week") → "deadline".

If the user specifies an exact date (e.g., “on October 7,” “on Monday”) → "date".

Infer the date relative to the current date if given in natural language (e.g., “tomorrow” = current_date + 1 day).

Format date as "YYYY-MM-DD".

priority, required_stamina, estimated_time:

Estimate values based on context, user's phrasing, and similarity with previous tasks in the provided list.

priority: 1-5 (5 = highest urgency).

required_stamina: 1-5 (5 = very demanding task).

estimated_time: integer minutes.

status:

If user says the task is already done → "done".

If they are currently working on it → "in progress".

Otherwise → "planned".

Output format list of objects
export interface Task {
  OPERATION: "Add" | "Modify";
  name: string;
  date?: string; // Using string for ISO 8601 datetime format, both deadline and date type can use this field, in case of deadline date means end of deadline
  date_type: "deadline" | "date";
  priority: 1 | 2 | 3 | 4 | 5;
  required_stamina: 1 | 2 | 3 | 4 | 5;
  estimated_time: number; // in minutes
  status: "planned" | "done" | "in progress";
}

Output strictly list of new tasks in list of JSON files with no explanation, markdown, or extra text.
`;

    const full_prompt = `
    ${mockPrompt}
    User input:
    ${text}
    List of tasks:
    ${tasks}
    `
    return getJsonResponse(`${mockPrompt}`);
}

export async function pickNextTask(): Promise<GeminiTask | null> {
    const mockPrompt = `Hello word`;
    return getJsonResponse(mockPrompt);
}

export const processTaskOperations = (
    geminiTasks: GeminiTask[],
    tasks: Task[],
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void,
    modifyTask: (task: Task) => void
): string => {
  const results: string[] = [];

  for (const geminiTask of geminiTasks) {
    switch (geminiTask.operation) {
      case 'add': {
        const { operation, ...newTaskData } = geminiTask;
        addTask(newTaskData);
        results.push(`Added new task: "${newTaskData.name}".`);
        break;
      }

      case 'modify': {

        const originalTask = tasks.find(t => t.name === geminiTask.name);

        if (originalTask) {
          const updatedTask = { ...originalTask, ...geminiTask };
          modifyTask(updatedTask);
          results.push(`Modified task: "${originalTask.name}".`);
        } else {
          results.push(`Could not find a task named "${geminiTask.name}" to modify.`);
        }
        break;
      }

      case 'select':
        throw new Error("The 'select' operation is not a supported task modification.");

      default:
        results.push(`Unknown operation '${(geminiTask as any).operation}' for task "${geminiTask.name}".`);
        break;
    }
  }

  if (results.length === 0) {
    return "No operations were performed.";
  }

  return results.join('\n');
};

