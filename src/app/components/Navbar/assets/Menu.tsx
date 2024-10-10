"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

type MenuProps = {
  links: Link[];
  className?: string;
};

export default function Menu({ links, className }: MenuProps) {
  const path = usePathname();
  const [width, setWidth] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResize = () => setWidth(window.innerWidth);

  const handleMobileMenuClick = () => setIsMobileMenuOpen(true);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopView = (
    <div className={`flex flex-row gap-2 ${className}`}>
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

  const mobileView = (
    <div className={`flex flex-col gap-2 ${className}`}>
      {isMobileMenuOpen ? (
        links.map((link) => (
          <Link
            href={link.href}
            key={link.name}
            className={`text-xl ${link.href === path ? "font-bold" : ""}`}
          >
            {link.name}
          </Link>
        ))
      ) : (
        <FaBars className="text-2xl" onClick={handleMobileMenuClick} />
      )}
    </div>
  );

  return width < 768 ? mobileView : desktopView;
}
