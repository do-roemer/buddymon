import { NextResponse } from "next/server";
import { resolveBattle } from "@buddymon/shared";
import { getBuddy, storeBattle } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { buddy1Id, buddy2Id } = await req.json();

    if (!buddy1Id || !buddy2Id) {
      return NextResponse.json(
        { error: "Both buddy1Id and buddy2Id are required" },
        { status: 400 },
      );
    }

    if (buddy1Id === buddy2Id) {
      return NextResponse.json(
        { error: "Cannot battle against yourself!" },
        { status: 400 },
      );
    }

    const buddy1 = await getBuddy(buddy1Id);
    const buddy2 = await getBuddy(buddy2Id);

    if (!buddy1 || !buddy2) {
      return NextResponse.json(
        { error: "One or both buddies not found" },
        { status: 404 },
      );
    }

    const result = resolveBattle(buddy1.card, buddy2.card);
    const battle = await storeBattle(result, buddy1Id, buddy2Id);

    return NextResponse.json({ battle });
  } catch {
    return NextResponse.json(
      { error: "Failed to process battle" },
      { status: 500 },
    );
  }
}
