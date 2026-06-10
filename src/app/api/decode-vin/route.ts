import { NextResponse } from "next/server";
import { decodeVin } from "@/lib/vin-decoder";

export async function POST(request: Request) {
  let vin: string;

  try {
    const body = (await request.json()) as { vin?: unknown };
    vin = typeof body.vin === "string" ? body.vin : "";
  } catch {
    return NextResponse.json({ error: "Send a VIN as JSON." }, { status: 400 });
  }

  if (!vin.trim()) {
    return NextResponse.json({ error: "Enter a VIN to decode." }, { status: 400 });
  }

  const result = await decodeVin(vin);
  return NextResponse.json({ result });
}
