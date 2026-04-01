import { NextResponse } from "next/server";
import { getAllBuddies } from "@/lib/db";

export async function GET() {
  const buddies = getAllBuddies();
  return NextResponse.json({ buddies });
}
