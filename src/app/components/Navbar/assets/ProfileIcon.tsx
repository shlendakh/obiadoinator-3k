"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
// import { useRouter } from "next/navigation";

type ProfileIconProps = {
  size: number;
  className?: string;
};

export default function ProfileIcon({ size, className }: ProfileIconProps) {
  // const router = useRouter();
  const { data: session } = useSession();
  const [isIconClicked, setIsIconClicked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set size value for mimic tailwind class breakpoints (eg h-12 -> height: 48px)
  const tailwindSize = Math.floor(size / 4) * 4;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsIconClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session) {
    // Zwróć stronę logowania, jeśli nie ma sesji
    return (
      <div className={`${className}`}>
        <Link href="/api/auth/signin" title="Log In">
          <div
            style={{ width: `${tailwindSize}px`, height: `${tailwindSize}px` }}
            className={`border-2 border-yellow-800 hover:border-yellow-900 rounded-full bg-slate-300 hover:bg-slate-400`}
          ></div>
        </Link>
      </div>
    );
  }

  const handleClick = () => {
    setIsIconClicked(!isIconClicked);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${className} cursor-pointer rounded-full border-4 hover:border-slate-500 hover:bg-gray-200 hover:opacity-80 transition duration-200 ${
          isIconClicked
            ? "border-slate-500 bg-gray-200 opacity-80"
            : "border-yellow-800"
        }`}
        style={{
          width: `${tailwindSize}px`,
          height: `${tailwindSize}px`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: session?.user?.image
            ? `url("${session.user.image}")`
            : "",
        }}
        onClick={handleClick}
      ></div>
      {isIconClicked && (
        <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-2">
            <li className="block py-2 mx-4 font-bold text-center border-b-2 border-gray-200">
              {session.user?.name}
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="/family"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Family Settings
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
