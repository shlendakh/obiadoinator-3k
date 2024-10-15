"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

const LoginComponent = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center p-4 mx-auto overflow-hidden">
      <h2 className="py-4 text-2xl font-bold">Zaloguj się</h2>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex flex-row items-center justify-center gap-3 px-4 py-2 mb-2 font-medium text-white rounded-md w-72 bg-slate-300"
      >
        <FaGoogle className="" />
        Zaloguj się przez Google
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="flex flex-row items-center justify-center gap-3 px-4 py-2 mb-2 font-medium text-white bg-yellow-800 rounded-md w-72"
      >
        <FaGithub className="" /> Zaloguj się przez GitHub
      </button>
    </div>
  );
};

export default LoginComponent;
