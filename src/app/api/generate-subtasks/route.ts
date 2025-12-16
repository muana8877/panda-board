import { NextResponse } from "next/server";
import { generateSubtasksWithAI } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    }

    const subtasks = await generateSubtasksWithAI(title, description);
    return NextResponse.json({ subtasks });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to generate subtasks" }, { status: 500 });
  }
}