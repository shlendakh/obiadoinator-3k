import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: NextRequest) {
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

    //
    const { familyId } = await req.json();

    const familyMember = await prisma.familyMember.findFirst({
      where: {
        familyId: familyId,
        user: {
          email: userEmail,
        },
        role: "owner",
      },
    });

    // If not a member nor owner
    if (!familyMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete family
    const updatedFamily = await prisma.family.delete({
      where: { id: familyId },
    });

    return NextResponse.json(updatedFamily, { status: 200 });

    // asdasd
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
