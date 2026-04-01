import { NextResponse } from "next/server";
import { getBuddyByName } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const buddy = await getBuddyByName(decodeURIComponent(name));

  if (!buddy) {
    return NextResponse.json(
      { error: `No buddy found with name "${name}"` },
      { status: 404 },
    );
  }

  return NextResponse.json({ buddy });
}
