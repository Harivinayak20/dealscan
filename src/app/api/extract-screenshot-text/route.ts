import { NextResponse } from "next/server";
import { extractScreenshotTextWithGroq } from "@/lib/groq-vision";

export const runtime = "edge";

export async function POST(request: Request) {
  let imageDataUrl: string;

  try {
    const body = (await request.json()) as { imageDataUrl?: unknown };
    imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";
  } catch {
    return NextResponse.json({ error: "Send a screenshot image as JSON." }, { status: 400 });
  }

  try {
    const text = await extractScreenshotTextWithGroq(imageDataUrl);
    return NextResponse.json({ text });
  } catch (caughtError) {
    return NextResponse.json(
      { error: caughtError instanceof Error ? caughtError.message : "Could not read that screenshot." },
      { status: 400 },
    );
  }
}
