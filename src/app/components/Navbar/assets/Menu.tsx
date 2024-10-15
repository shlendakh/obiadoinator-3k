"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type MenuProps = {
  links: Link[];
  className?: string;
};

export default function Menu({ links, className }: MenuProps) {
  const path = usePathname();
  const [width, setWidth] = useState(0);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResize = () => setWidth(window.innerWidth);

  // const handleMobileMenuClick = () => setIsMobileMenuOpen(true);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopView = (
    <NavigationMenu>
      <NavigationMenuList className={`flex flex-row gap-2 ${className}`}>
        {links.map((link) => (
          <NavigationMenuItem key={link.name}>
            <Link
              href={link.href}
              className={`text-xl ${link.href === path ? "font-bold" : ""}`}
            >
              {link.name}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const mobileView = (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FaBars className="text-2xl" />
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={`flex flex-col gap-2 p-4 ${className}`}
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xl ${link.href === path ? "font-bold" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  return width < 768 ? mobileView : desktopView;
}
