"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type MenuProps = {
  links: Link[];
  className?: string;
};

export default function Menu({ links, className }: MenuProps) {
  const path = usePathname();
  const [width, setWidth] = useState<null | number>(null);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      {width}
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.name}
          className={`text-xl ${link.href === path ? "font-bold" : ""}`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
