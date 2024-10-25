import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Return "unauthorized" if didn't catch session at all
  if (!session) {
    return NextResponse.json(
      { message: "Nieautoryzowany dostęp" },
      { status: 401 }
    );
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

    // Check if user is member of any family
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
        { status: 200 }
      );
    }

    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        familyId: familyMember.familyId,
      },
    });

    // If everything is allright return info about family
    return NextResponse.json({ shoppingList }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
