// /app/shopping/page.tsx (strona serwerowa)
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Link from "next/link";

export default async function Shopping() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Zwróć stronę logowania, jeśli nie ma sesji
    return (
      <div>
        Access Denied. Please <Link href="/api/auth/signin">log in</Link>.
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to Shopping, {session.user?.name}</h1>
      {/* Reszta treści strony */}
    </div>
  );
}
