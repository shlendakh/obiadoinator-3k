import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

async function validateUserSession(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return {
      error: NextResponse.json(
        { message: "User email is missing" },
        { status: 400 }
      ),
    };
  }

  const familyMember = await prisma.familyMember.findFirst({
    where: { user: { email: userEmail } },
    include: { family: true },
  });

  if (!familyMember) {
    return {
      error: NextResponse.json(
        { message: "User does not belong to any family" },
        { status: 404 }
      ),
    };
  }

  return { session, familyMember };
}

export async function GET(req: NextRequest) {
  const { session, familyMember, error } = await validateUserSession(req);
  if (error) return error;

  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is missing" },
        { status: 400 }
      );
    }

    const productInfo = await prisma.shoppingItem.findFirst({
      where: { id: productId },
    });

    if (!productInfo) {
      return NextResponse.json(
        { message: "No product found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ productInfo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { session, familyMember, error } = await validateUserSession(req);
  if (error) return error;

  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is missing" },
        { status: 400 }
      );
    }

    const { productname, quantity, unit, categoryId } = await req.json();

    console.log("Received data:", { productname, quantity, unit, categoryId });

    // Sprawdzenie tylko dla null lub undefined (umożliwia 0 dla quantity i null dla unit, categoryId)
    if (productname == null || quantity == null) {
      return NextResponse.json(
        { message: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    // Przygotowanie danych do aktualizacji, pozwala na `null` dla opcjonalnych pól
    const productInfo = await prisma.shoppingItem.update({
      where: { id: productId },
      data: {
        customProductName: productname,
        quantity,
        unit: unit || null, // Przypisanie `null` jeśli brak wartości
        categoryId: categoryId || null, // Przypisanie `null` jeśli brak wartości
      },
    });

    if (!productInfo) {
      return NextResponse.json(
        { message: "No product found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ productInfo }, { status: 200 });
  } catch (error) {
    console.error("Internal server error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
