import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let allOrders;
    if (session.role === "admin") {
      allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    } else {
      allOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, session.userId))
        .orderBy(desc(orders.createdAt));
    }

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            unitPrice: orderItems.unitPrice,
            productName: products.name,
            productImage: products.imageUrl,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, orderType, paymentMethod, deliveryAddress, notes } =
      await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must have at least one item" },
        { status: 400 }
      );
    }

    // Calculate total
    let totalAmount = 0;
    const itemsWithPrices: Array<{
      productId: number;
      quantity: number;
      unitPrice: string;
    }> = [];

    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      const unitPrice = parseFloat(product.price);
      totalAmount += unitPrice * item.quantity;
      itemsWithPrices.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    const [order] = await db
      .insert(orders)
      .values({
        userId: session.userId,
        orderType,
        paymentMethod,
        totalAmount: totalAmount.toFixed(2),
        deliveryAddress: deliveryAddress || null,
        notes: notes || null,
      })
      .returning();

    for (const item of itemsWithPrices) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
