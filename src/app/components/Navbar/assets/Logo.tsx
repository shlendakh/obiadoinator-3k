import React from "react";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size: number;
  className?: string;
};

const srcLogo = "/icons/logo.webp";

export default function Logo({ size, className }: LogoProps) {
  return (
    <div className={`${className}`}>
      <Link href="/">
        <Image
          src={srcLogo}
          alt="Logo App"
          width={size}
          height={size}
          className="rounded-xl"
        />
      </Link>
    </div>
  );
}
