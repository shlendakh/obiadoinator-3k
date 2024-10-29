import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Return "unauthorized" if session is missing
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user?.email;

    // Return message if user email is missing from session
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is missing" },
        { status: 400 }
      );
    }

    // Check if user is a member of any family
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        user: {
          email: userEmail,
        },
      },
      include: {
        family: true,
      },
    });

    // If user doesn't belong to any family
    if (!familyMember) {
      return NextResponse.json(
        { message: "User does not belong to any family" },
        { status: 404 }
      );
    }

    // Get shoppingListId from query parameters
    const shoppingListId = req.nextUrl.searchParams.get("shoppingListId");

    if (!shoppingListId) {
      return NextResponse.json(
        { message: "Shopping list ID is missing" },
        { status: 400 }
      );
    }

    console.log(shoppingListId);

    // Find the products in the shopping list
    const productsList = await prisma.shoppingItem.findMany({
      where: {
        shoppingListId,
      },
    });

    // If the shopping list is empty or not found
    if (!productsList.length) {
      return NextResponse.json(
        { message: "No products found in the shopping list" },
        { status: 404 }
      );
    }

    // Return the list of products
    return NextResponse.json({ productsList }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
