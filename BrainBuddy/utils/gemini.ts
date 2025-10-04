import axios from "axios";
import { GeminiTask, OperationPick, Task } from "@/constants/types";

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

export async function getOperationType(text: string): Promise<OperationPick | null> {
    const prompt = `
You are a classification model that determines what kind of operation the user is requesting.

There are two possible operations:

"update" → The user is adding, modifying, or managing tasks.

Examples:

“Add a new task to write my report.”

“Update my gym task to tomorrow.”

“I finished writing two pages.”

“Change deadline of my project.”

"select" → The user is asking what task to do next or requesting a suggestion based on available time or priority.

Examples:

“I have 30 minutes free, what should I do?”

“Give me something productive to do now.”

“What task should I focus on next?”

Your task:

Based only on the meaning of the user's message, choose which operation fits best.
Do not explain or add extra text — just return a JSON object in this exact format:
{
  "operation": "select"
}
or 
{
  "operation": "update"
}
Additional rules:

If the user mentions adding, changing, completing, or planning a task → "update"

If the user asks for a recommendation or what to do now → "select"

Never include extra text or explanations — return only valid JSON.

User input: "${text}"
`;

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
                console.warn(`Attempt ${4 - retries}: Gemini (operation pick) returned an empty response. Retrying.`);
                retries--;
                continue;
            }

            const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
            const parsedJson = JSON.parse(cleanedResponse);

            if (parsedJson.operation && (parsedJson.operation === 'select' || parsedJson.operation === 'update')) {
                return parsedJson as OperationPick;
            } else {
                console.warn(`Attempt ${4 - retries}: Validation failed for operation pick response: ${cleanedResponse}. Retrying.`);
                retries--;
            }
        } catch (error) {
            console.error(`Attempt ${4 - retries}: Error parsing or fetching Gemini operation pick response.`, error);
            retries--;
        }
    }
    
    console.error("Failed to get a valid operation pick from Gemini after 3 attempts.");
    return null;
}

export async function getJsonResponse(prompt: string): Promise<GeminiTask[] | null> {
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
            console.log("---GEMINI RAW OUTPUT---");
            console.log(rawResponse);
            console.log("-----------------------");
            if (!rawResponse) {
                console.warn(`Attempt ${4 - retries}: Gemini returned an empty response. Retrying.`);
                retries--;
                continue;
            }

            const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
            const parsedJson = JSON.parse(cleanedResponse);
            
            const potentialTasks = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
            const isValid = potentialTasks.length > 0 && potentialTasks.every(
              (task: any) => task.operation && task.name && task.date_type
            );

            if (isValid) {
                return potentialTasks as GeminiTask[];
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

export async function parseTaskOperation(text: string, tasks: Task[]): Promise<GeminiTask[] | null> {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const currentDate = today.toISOString().split('T')[0];
    const mockPrompt = `
You are a task extraction assistant.
Your job is to read the user's input about tasks and generate list of JSON objects following the Task interface.

You will be provided with:

A list of existing tasks (with their fields filled).

The current date: Today is ${dayOfWeek}, ${currentDate}.

The user's input text, wjhich can contain more than one task.

Rules:

OPERATION:

If the user explicitly says they want to add something new → "add".

If they mention changing/updating an existing task → "modify".

If unclear, infer the most likely option and choose "add" or "modify".

name:

Extract the task description from the user input.

You may rephrase it into a clearer, prettier task name if needed.

date_type and date:

If the task must be finished before a time limit or has a due timeframe (e.g., “by tomorrow,” “before Friday,” “in 2 days”, "till the end of the week") → "deadline".

If the user specifies an exact date (e.g., “on October 7,” “on Monday”, "now", "at the moment", "tomorrow") → "date".

Infer the date relative to the current date if given in natural language (e.g., “tomorrow” = current_date + 1 day).

Format date as "YYYY-MM-DDThh:mm:ssZ". It must be included every single time.

priority, required_stamina, estimated_time:

Estimate values based on context, user's phrasing, and similarity with previous tasks in the provided list.

priority: 1-5 (1 = highest urgency).

required_stamina: 1-5 (5 = very demanding task).

estimated_time: integer minutes.

status:

If user says the task is already done → "done".

If they are currently working on it → "in progress".

Otherwise → "planned".

Output format list of objects
export interface Task {
  operation: "add" | "modify";
  name: string;
  date?: string;
  date_type: "deadline" | "date";
  priority: 1 | 2 | 3 | 4 | 5;
  required_stamina: 1 | 2 | 3 | 4 | 5;
  estimated_time: number; // in minutes
  status: "planned" | "done" | "in progress";
}

Output strictly list of new tasks in list of JSON files with no explanation, markdown, or extra text. All fields must be filled.
`;

    const full_prompt = `
    ${mockPrompt}
    Current tasks:
    ${JSON.stringify(tasks, null, 2)}
    
    User input:
    "${text}"
    `
    console.log("---GEMINI PROMPT---");
    console.log(full_prompt);
    console.log("-------------------");
    return getJsonResponse(full_prompt);
}

export async function selectTask(text: string, tasks: Task[]): Promise<string> {
    const prompt = `
You are a Daily Task Selection Assistant that helps the user decide what to do when they have a specific amount of free time.
The user will tell you how much time they have (for example: “I have 30 minutes", "I have some free time"), and you will receive a list of tasks in JSON format following this structure:

Here is the text provided by the user:
${text}

Here is the current list of tasks:
${JSON.stringify(tasks.filter(t => t.status !== 'done'), null, 2)}

export interface Task {
  id?: string;
  name: string;
  date?: string; // Using string for ISO 8601 datetime format, both deadline and date type can use this field, in case of deadline date means end of deadline
  date_type: "deadline" | "date";
  created_at: Date;
  updated_at: Date;
  priority: 1 | 2 | 3 | 4 | 5;
  required_stamina: 1 | 2 | 3 | 4 | 5;
  estimated_time: number; // in minutes
  status: "planned" | "done" | "in progress";
}

Your Goal

Based on the given list and the user's available time:

Choose the most suitable task the user can realistically do right now.

If no full task fits, suggest doing a smaller portion of a high-priority task.

If there's very little time, suggest something quick and useful.

If there's plenty of time, recommend the most important and high-priority task that fits.

Take into account:

Priority (5 = highest importance)

Time available

Stamina requirement (don't propose very demanding tasks for short breaks)

Status (ignore tasks already done)

Deadlines (prefer tasks with closer deadlines or haave date_type "date" and todays date in date field)


Output Format

Respond with a natural, spoken-style message that a voice assistant could read aloud — no JSON, no formatting, no lists.
Keep it clear, conversational, and motivating.

Example outputs:

“You could use this half hour to write a short section of your thesis — it's one of your top priorities and fits perfectly in this time.”

“You've got 20 minutes free. That's just right to review your notes or read a few pages from your research article.”

“There's not enough time to finish the full task, but you could make progress by outlining the next part of your app feature.”

Provide just one suggestion
`;

    return getStringResponse(prompt);
}


export const processTaskOperations = (
    geminiTasks: GeminiTask[],
    tasks: Task[],
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void,
    modifyTask: (task: Task) => void
): string => {
  let addedCount = 0;
  let modifiedCount = 0;

  for (const geminiTask of geminiTasks) {
    switch (geminiTask.operation) {
      case 'add': {
        const { operation, ...newTaskData } = geminiTask;
        addTask(newTaskData);
        addedCount++;
        break;
      }
      case 'modify': {
        const originalTask = tasks.find(t => t.name.toLowerCase() === geminiTask.name.toLowerCase());
        if (originalTask) {
          const updatedTask = { ...originalTask, ...geminiTask };
          modifyTask(updatedTask);
          modifiedCount++;
        } else {
          const { operation, ...newTaskData } = geminiTask;
          addTask(newTaskData);
          addedCount++;
        }
        break;
      }
      default:
        break;
    }
  }
  if (geminiTasks.length === 1) {
    const task = geminiTasks[0];
    if (addedCount === 1 && modifiedCount === 0) {
      return `I've added the task: ${task.name}.`;
    }
    if (modifiedCount === 1 && addedCount === 0) {
      return `I've updated the task: ${task.name}.`;
    }
  }

  const summaryParts: string[] = [];
  if (addedCount > 0) {
    summaryParts.push(`Added ${addedCount} task${addedCount > 1 ? 's' : ''}`);
  }
  if (modifiedCount > 0) {
    summaryParts.push(`Modified ${modifiedCount} task${modifiedCount > 1 ? 's' : ''}`);
  }

  if (summaryParts.length === 0) {
    return 'Your request was processed, but no tasks were changed.';
  }

  return `Done. ${summaryParts.join(' and ')}.`;
};
