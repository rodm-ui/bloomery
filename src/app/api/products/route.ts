import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");

    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        inStock: products.inStock,
        featured: products.featured,
        createdAt: products.createdAt,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    // Apply filters using where clause
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(products.categoryId, parseInt(categoryId)));
    }
    if (featured === "true") {
      conditions.push(eq(products.featured, true));
    }

    let result;
    if (conditions.length === 1) {
      result = await query.where(conditions[0]);
    } else if (conditions.length === 2) {
      const { and } = await import("drizzle-orm");
      result = await query.where(and(conditions[0], conditions[1]));
    } else {
      result = await query;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, price, imageUrl, categoryId, inStock, featured } =
      await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({
        name,
        description: description || null,
        price: price.toString(),
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured || false,
      })
      .returning();

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
