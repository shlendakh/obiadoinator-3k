"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { ItemCategory } from "@prisma/client";
import { ShoppingItem } from "@prisma/client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import EditCard from "../EditCard/EditCard";

type ShoppingItemParams = {
  params: ShoppingItem;
  categoryList: ItemCategory[];
};

const base64ToImgUrl = (categoryIcon: Buffer, color?: string) => {
  let base64Icon = Buffer.from(categoryIcon).toString("utf-8");

  if (!/fill=".*?"/.test(base64Icon)) {
    base64Icon = base64Icon.replace(/<svg/, `<svg fill="${color || "black"}"`);
  } else {
    base64Icon = base64Icon.replace(/fill=".*?"/, `fill="${color || "black"}"`);
  }

  base64Icon = Buffer.from(base64Icon, "utf-8").toString("base64");

  return `data:image/svg+xml;base64,${base64Icon}`;
};

export const ShoppingItemRow = ({
  params,
  categoryList,
}: ShoppingItemParams) => {
  const [product, setProduct] = useState<ShoppingItem>(params);
  const [open, setOpen] = useState<boolean>(false);

  const categoryIcon = () => {
    if (!product.categoryId) return null;

    const category = categoryList.find((el) => el.id === product.categoryId);
    if (!category || !category.icon) return null;

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
    <>
      {/* Product row render */}
      <Card className="flex flex-col justify-center w-11/12 md:w-1/2 h-16 shadow-md">
        <CardContent className="flex items-center h-full px-10 py-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              {product.isChecked ? (
                <FaRegCheckCircle className="text-lg text-green-500" />
              ) : (
                <FaRegCircle className="text-lg text-blue-500" />
              )}
              <button
                onClick={() => setOpen(true)} // Otwiera EditCard
                className="text-lg font-semibold hover:text-slate-500"
              >
                {product.customProductName || "Unnamed Product"}
              </button>
            </div>
            <div className="grid grid-cols-[1fr_24px] gap-8">
              <p className="text-lg font-medium text-slate-400">
                {product.quantity !== 0 ? product.quantity : ""} {product.unit}
              </p>
              {categoryIcon()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawer for product editing */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-4 flex flex-col">
          <DrawerTitle>Edit Product</DrawerTitle>
          <DrawerDescription>
            Update the details of your selected product here.
          </DrawerDescription>
          <EditCard
            params={product}
            categoryMap={categoryList}
            onSuccess={(updatedProduct) => {
              if (updatedProduct) setProduct(updatedProduct);
              setOpen(false);
            }}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
};
