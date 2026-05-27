import { NextResponse } from "next/server";

// ⚠️ TEMP STORAGE (replace with DB in future like Firebase/Mongo)
const db: Record<string, string[]> = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, layout } = body;

    if (!userId || !Array.isArray(layout)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    db[userId] = layout;

    return NextResponse.json({
      success: true,
      layout,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      layout: db[userId] || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}