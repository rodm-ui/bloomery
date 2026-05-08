import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, categories, products, contactInfo } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    // Check if admin already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@bloomery.com"))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    await db.insert(users).values({
      name: "Admin",
      email: "admin@bloomery.com",
      password: adminPassword,
      role: "admin",
      phone: "+63 917 123 4567",
    });

    // Create demo customer
    const customerPassword = await hashPassword("customer123");
    await db.insert(users).values({
      name: "Maria Santos",
      email: "maria@example.com",
      password: customerPassword,
      role: "customer",
      phone: "+63 918 765 4321",
      address: "123 Sampaguita St., Quezon City, Metro Manila",
    });

    // Create categories
    const [romantic] = await db
      .insert(categories)
      .values({
        name: "Romantic Bouquets",
        description: "Express your love with stunning romantic bouquets",
        imageUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400",
      })
      .returning();

    const [wedding] = await db
      .insert(categories)
      .values({
        name: "Wedding Bouquets",
        description: "Elegant bridal and bridesmaid bouquets",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400",
      })
      .returning();

    const [birthday] = await db
      .insert(categories)
      .values({
        name: "Birthday Bouquets",
        description: "Vibrant bouquets for birthday celebrations",
        imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
      })
      .returning();

    const [sympathy] = await db
      .insert(categories)
      .values({
        name: "Sympathy & Funeral",
        description: "Thoughtful arrangements for remembrance",
        imageUrl: "https://images.unsplash.com/photo-1558652093-2781515e0425?w=400",
      })
      .returning();

    const [seasonal] = await db
      .insert(categories)
      .values({
        name: "Seasonal Bouquets",
        description: "Fresh seasonal flowers in beautiful bouquets",
        imageUrl: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400",
      })
      .returning();

    // Create products — all bouquets, prices in Philippine Peso
    await db.insert(products).values([
      {
        name: "Red Rose Romance Bouquet",
        description:
          "A breathtaking hand-tied bouquet of 24 premium long-stem red roses, wrapped in elegant satin ribbon. Perfect for anniversaries, Valentine's Day, or declaring your love.",
        price: "2499.00",
        imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500",
        categoryId: romantic.id,
        featured: true,
        inStock: true,
      },
      {
        name: "Pink Blush Bouquet",
        description:
          "Delicate arrangement of soft pink roses, peonies, and baby's breath. A gentle expression of admiration and sweetness.",
        price: "1899.00",
        imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500",
        categoryId: romantic.id,
        featured: true,
        inStock: true,
      },
      {
        name: "Forever Yours Mixed Bouquet",
        description:
          "A luxurious mix of red and white roses accented with eucalyptus and greenery. Timeless elegance for any romantic occasion.",
        price: "2199.00",
        imageUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500",
        categoryId: romantic.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Classic Bridal Bouquet",
        description:
          "Pristine white roses, lilies, and stephanotis arranged in a cascading design. The perfect bouquet for your walk down the aisle.",
        price: "3499.00",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
        categoryId: wedding.id,
        featured: true,
        inStock: true,
      },
      {
        name: "Bridesmaid's Pastel Bouquet",
        description:
          "Charming pastel-toned bouquet with garden roses, ranunculus, and dusty miller. Coordinated elegance for your bridal party.",
        price: "1599.00",
        imageUrl: "https://images.unsplash.com/photo-1558652093-2781515e0425?w=500",
        categoryId: wedding.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Rainbow Celebration Bouquet",
        description:
          "A vibrant explosion of colorful gerberas, tulips, and sunflowers. Guaranteed to bring a smile on any birthday!",
        price: "1499.00",
        imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500",
        categoryId: birthday.id,
        featured: true,
        inStock: true,
      },
      {
        name: "Sunflower Sunshine Bouquet",
        description:
          "Bright and cheerful bouquet of sunflowers paired with daisies and wildflowers. A ray of happiness in every petal.",
        price: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=500",
        categoryId: birthday.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Garden Party Bouquet",
        description:
          "A lush, garden-style bouquet featuring a mix of seasonal blooms, roses, and fresh foliage. Perfect for birthday celebrations.",
        price: "1699.00",
        imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500",
        categoryId: birthday.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Peaceful Whites Bouquet",
        description:
          "An elegant arrangement of white lilies, roses, and chrysanthemums. A dignified and heartfelt tribute.",
        price: "1999.00",
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500",
        categoryId: sympathy.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Spring Tulip Bouquet",
        description:
          "Fresh seasonal tulips in assorted colors, hand-wrapped with kraft paper and twine. A delightful spring surprise.",
        price: "999.00",
        imageUrl: "https://images.unsplash.com/photo-1589994160839-163cd867cfe8?w=500",
        categoryId: seasonal.id,
        featured: true,
        inStock: true,
      },
      {
        name: "Lavender Dreams Bouquet",
        description:
          "Soothing arrangement of lavender roses, purple lisianthus, and fragrant stock. An enchanting bouquet for any occasion.",
        price: "1799.00",
        imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500",
        categoryId: seasonal.id,
        featured: false,
        inStock: true,
      },
      {
        name: "Tropical Paradise Bouquet",
        description:
          "Exotic bouquet featuring bird of paradise, orchids, and tropical greenery. A stunning statement arrangement.",
        price: "2799.00",
        imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500",
        categoryId: seasonal.id,
        featured: false,
        inStock: true,
      },
    ]);

    // Create contact info
    await db.insert(contactInfo).values({
      phone: "+63 917 123 4567",
      email: "hello@bloomery.ph",
      address: "456 Rosal Avenue, Makati City, Metro Manila, Philippines",
      facebook: "https://facebook.com/bloomeryph",
      instagram: "https://instagram.com/bloomeryph",
      openHours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    });

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
