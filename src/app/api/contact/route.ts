import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactInfo } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const [info] = await db.select().from(contactInfo).limit(1);
    return NextResponse.json(info || null);
  } catch (error) {
    console.error("Get contact error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const [existing] = await db.select().from(contactInfo).limit(1);

    let result;
    if (existing) {
      [result] = await db
        .update(contactInfo)
        .set(data)
        .where(eq(contactInfo.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(contactInfo).values(data).returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 }
    );
  }
}
