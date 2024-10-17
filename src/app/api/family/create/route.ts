import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Return message if didn't catch user email from session
    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is missing" },
        { status: 400 }
      );
    }

    const { name } = await req.json();

    // Create new family
    const family = await prisma.family.create({
      data: {
        name: name,
        members: {
          create: {
            user: {
              connect: {
                email: userEmail,
              },
            },
            role: "owner",
          },
        },
      },
    });

    // Create a shopping list for the newly created family
    const shoppingList = await prisma.shoppingList.create({
      data: {
        familyId: family.id,
        name: "Shopping List",
      },
    });

    // Confirm creating new family
    return NextResponse.json({ family, shoppingList }, { status: 201 });
    // asdasdasads
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
