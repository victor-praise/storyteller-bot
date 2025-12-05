// app/api/generate-story-image/route.ts
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // required because we use fs

function slugifyTitle(title: string) {
  return title
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "") // remove illegal filename chars (Windows-safe)
    .replace(/\s+/g, "-")          // spaces -> dashes
    .toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, storyTitle, pageNumber } = body;

    if (!prompt || !storyTitle || !pageNumber) {
      return NextResponse.json(
        { error: "prompt, storyTitle and pageNumber are required" },
        { status: 400 }
      );
    }

    // 1) Call OpenAI Images API
const result = await openai.images.generate({
  model: "dall-e-3",
  prompt,
  size: "1024x1024",      // or "1024x1024", "1024x1792", etc.
  quality: "standard",    // or "hd"
  n: 1,
  response_format: "b64_json",
});


    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image data returned from OpenAI" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(imageBase64, "base64");

    // 2) Build disk path: /public/stories/<story-title-slug>/page<N>.png
    const safeTitle = slugifyTitle(storyTitle);
    const dir = path.join(process.cwd(), "public", "stories", safeTitle);
    const fileName = `page${pageNumber}.png`;
    const filePath = path.join(dir, fileName);

    // Make sure directory exists (GPTScript should already have created it,
    // but this is safe and idempotent)
    await fs.mkdir(dir, { recursive: true });

    // 3) Save file
    await fs.writeFile(filePath, buffer);

    // 4) Return URL served by Next (from /public)
    const publicUrl = `/stories/${safeTitle}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json(
      { error: err?.message || "Image generation failed" },
      { status: 500 }
    );
  }
}
