import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (prompt: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Try a list of candidate models and fall back gracefully when a model is not available
const CANDIDATE_MODELS = [
  "gemini-2.5-flash-lite", // 1st Choice: High free quota, very fast
  "gemini-2.5-flash",      // 2nd Choice: Standard flash model
  "gemini-2.0-flash",
];

async function tryGenerateWithModel(modelName: string, prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    // If the model isn't supported or not found, some APIs return 404 or specific messages.
    // Surface the error so caller can decide to try the next candidate.
    throw err;
  }
}

export const generateSubtasksWithAI = async (
  taskTitle: string,
  taskDescription: string
): Promise<string[]> => {
  // Validate input
  if (!taskTitle?.trim()) {
    throw new Error("Task title is empty. Please provide a task name.");
  }

  if (!taskDescription?.trim() || taskDescription.length < 10) {
    throw new Error(
      "Task description is too brief. Please provide a detailed description (at least 10 characters) to generate meaningful subtasks."
    );
  }

  const prompt = `You are a task management expert. Based on the following task, generate 4 concise, specific, actionable subtasks (preferably 2-3 if the task is short).

Task Title: ${taskTitle}
Task Description: ${taskDescription}

Guidelines:
- Each subtask should be specific and actionable
- Keep subtasks concise (3-12 words each)
- Subtasks should logically break down the main task
- Return ONLY the subtasks, one per line, without numbering or bullet points
- Do not include explanations or additional text`;

  // Try candidate models in order and return the first successful parse
  let lastErr: any = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const text = await tryGenerateWithModel(modelName, prompt);
      const subtasks = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line.length < 200)
        .slice(0, 7);

      if (subtasks.length === 0) {
        lastErr = new Error("AI returned no valid subtasks");
        continue;
      }

      return subtasks;
    } catch (err: any) {
      lastErr = err;
      // try next model
      continue;
    }
  }

  // If none worked, return a helpful error
  if (lastErr instanceof Error) {
    throw new Error(`AI generation failed: ${lastErr.message}`);
  }
  throw new Error("AI generation failed: unknown error");
};
