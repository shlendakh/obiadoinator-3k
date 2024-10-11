import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Image from "next/image";

type ProfileProps = {
  size: number;
  className?: string;
};

export default async function Profile({ size, className }: ProfileProps) {
  const session = await getServerSession(authOptions);

  // Set size value for mimic tailwind class breakpoints (eg h-12 -> height: 48px)
  const tailwindSize = Math.floor(size / 4) * 4;

  if (!session) {
    // Zwróć stronę logowania, jeśli nie ma sesji
    return (
      <div className={`${className}`}>
        <Link href="/api/auth/signout">
          <div
            style={{ width: `${tailwindSize}px`, height: `${tailwindSize}px` }}
            className={`border-2 border-yellow-800 rounded-full bg-slate-300`}
          ></div>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Link href="/api/auth/signout">
        <div
          style={{ width: `${tailwindSize}px`, height: `${tailwindSize}px` }}
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={`${session.user.name}`}
              height={tailwindSize}
              width={tailwindSize}
              className="rounded-full border-2 border-yellow-800 bg-slate-300"
            />
          ) : (
            <></>
          )}
        </div>
      </Link>
    </div>
  );
}
