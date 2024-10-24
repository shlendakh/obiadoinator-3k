"use client";

import React from "react";
import Image from "next/image";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { ItemCategory } from "@prisma/client";

type ShoppingItemParams = {
  key?: string;
  params: ShoppingItem;
  categoryList: ItemCategory[];
};

const base64ToImgUrl = (categoryIcon: Buffer, color?: string) => {
  let base64Icon = Buffer.from(categoryIcon).toString("utf-8");

  if (!/fill=".*?"/.test(base64Icon)) {
    base64Icon = base64Icon.replace(
      /<svg/,
      '<svg fill="' + (color || "black") + '"'
    );
  } else {
    base64Icon = base64Icon.replace(
      /fill=".*?"/,
      'fill="' + (color || "black") + '"'
    );
  }

  base64Icon = Buffer.from(base64Icon, "utf-8").toString("base64");

  return `data:image/svg+xml;base64,${base64Icon}`;
};

export const ShoppingItem = ({ params, categoryList }: ShoppingItemParams) => {
  const { isChecked, customProductName, quantity, unit, categoryId } = params;

  const categoryIcon = () => {
    if (!categoryId) return <p></p>;

    const category = categoryList.find((el) => el.id === categoryId);
    if (!category || !category.icon) return <p></p>;

    const imageUrl = base64ToImgUrl(category.icon);

    return (
      <Image
        src={imageUrl}
        alt={category.categoryName}
        width={24}
        height={24}
        className="w-6 h-6"
      />
    );
  };

  return (
    <Card className="flex flex-col justify-center w-1/2 h-16 shadow-md">
      <CardContent className="flex items-center h-full px-10 py-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {isChecked ? (
              <FaRegCheckCircle className="text-lg text-green-500" />
            ) : (
              <FaRegCircle className="text-lg text-blue-500" />
            )}
            <h2 className="text-lg font-semibold">
              {customProductName || "Unnamed Product"}
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_24px] gap-8">
            <p className="text-lg font-medium text-slate-400">
              {quantity} {unit}
            </p>
            {categoryIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
