import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an API.
You must respond with ONLY valid JSON.
No markdown.
No explanation.
No extra text.

Format:
{
  "home": "<html here>",
  "about": "<html here>",
  "contact": "<html here>"
}
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content;

    // ✅ HARD SAFE PARSE
    const json = JSON.parse(raw || "{}");

    return NextResponse.json(json);
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
