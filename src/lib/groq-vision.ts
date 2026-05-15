const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const OCR_TIMEOUT_MS = 10_000;
const MAX_DATA_URL_LENGTH = 27_000_000;

function groqApiKey() {
  return process.env.GROQ_API_KEY?.trim() || null;
}

function extractJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Groq did not return JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1)) as { text?: string };
}

export function validateImageDataUrl(imageDataUrl: string) {
  const trimmed = imageDataUrl.trim();

  if (!/^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=\s]+$/i.test(trimmed)) {
    throw new Error("Upload a PNG, JPG, or WebP screenshot.");
  }

  if (trimmed.length > MAX_DATA_URL_LENGTH) {
    throw new Error("Screenshot is too large. Upload an image under 20 MB.");
  }

  return trimmed.replace(/\s/g, "");
}

export async function extractScreenshotTextWithGroq(imageDataUrl: string) {
  const apiKey = groqApiKey();

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required for screenshot OCR.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OCR_TIMEOUT_MS);

  const response = await fetch(
    GROQ_API_URL,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_VISION_MODEL || GROQ_VISION_MODEL,
        temperature: 0,
        max_tokens: 1400,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract the visible used-car listing text from this screenshot. Return JSON only as {\"text\":\"...\"}. Include price, mileage, title status, VIN, seller notes, location, and condition claims when visible. Do not add facts that are not visible.",
              },
              {
                type: "image_url",
                image_url: {
                  url: validateImageDataUrl(imageDataUrl),
                },
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    },
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error("Groq OCR failed. Check the screenshot and API key.");
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  const parsed = text ? extractJson(text) : {};
  const extractedText = parsed.text?.trim() ?? "";

  if (extractedText.length < 20) {
    throw new Error("OCR could not find enough listing text in the screenshot.");
  }

  return extractedText;
}
