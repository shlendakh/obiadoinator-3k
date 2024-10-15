// import { SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-screen p-4 overflow-hidden">
      <p className="h-full">Hello</p>
      <p className="h-full">Hello</p>
      <Button variant="ghost">Click me</Button>
    </main>
  );
}
