import { NextResponse } from "next/server";
import { FighterCardSchema } from "@buddymon/shared";
import { uploadBuddy } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = FighterCardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid fighter card", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const buddy = uploadBuddy(parsed.data);
    return NextResponse.json({ buddy });
  } catch {
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 },
    );
  }
}
