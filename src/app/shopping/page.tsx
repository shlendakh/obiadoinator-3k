"use client";

import { useEffect, useState, useCallback } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { ShoppingItem } from "./components/ShoppingItem/ShoppingItem";
import { ItemCategory } from "@prisma/client";

interface ShoppingListInfo {
  shoppingList?: ShoppingList;
  message?: string;
}

interface ProductsListInfo {
  productsList?: ShoppingItem[];
  message?: string;
}

export default function Shopping() {
  // Router
  const router = useRouter();

  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [shoppingListInfo, setShoppingListInfo] =
    useState<ShoppingListInfo | null>(null);
  const [productsListInfo, setProductsListInfo] =
    useState<ProductsListInfo | null>(null);
  const [categoryList, setCategoryList] = useState<ItemCategory[]>([]);

  const fetchShoppingListInfo = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session) {
        // If user is not authenticated, redirect to login
        router.push("/api/auth/signin");
        return;
      }
      const response = await fetch("/api/shopping");
      if (!response.ok) {
        throw new Error("Failed to fetch family info");
      }
      const data = await response.json();
      if (data.message) {
        console.log(data.message);
      }

      setShoppingListInfo(data);
    } catch (error) {
      console.error("Failed to fetch family info", error);
    }
  }, [router]);

  const fetchProductsListInfo = useCallback(
    async (shoppingListId: string) => {
      try {
        const session = await getSession();
        if (!session) {
          // If user is not authenticated, redirect to login
          router.push("/api/auth/signin");
          return;
        }

        const response = await fetch(
          `/api/shopping/products-list?shoppingListId=${shoppingListId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shopping list info");
        }
        const data = await response.json();
        if (data.message) {
          console.log(data.message);
        }

        setProductsListInfo(data);
      } catch (error) {
        console.error("Failed to fetch products list info", error);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/info/category");
      if (!response.ok) {
        throw new Error("Failed to fetch category info");
      }
      const data = await response.json();
      setCategoryList(
        Array.isArray(data.categoryList) ? data.categoryList : []
      );
    } catch (error) {
      console.error("Failed to fetch category info", error);
    }
  }, []);

  useEffect(() => {
    fetchShoppingListInfo();
    fetchCategories();
  }, [fetchShoppingListInfo, fetchCategories]);

  useEffect(() => {
    if (shoppingListInfo?.shoppingList?.id) {
      fetchProductsListInfo(shoppingListInfo.shoppingList.id);
    }
  }, [shoppingListInfo, fetchProductsListInfo]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!shoppingListInfo) {
    return <p>Error loading shopping list information.</p>;
  }

  return (
    <>
      {/* <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Categories</h1>
        {categoryList.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {categoryList.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-2 border rounded-md"
              >
                <span>{category.categoryName}</span>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Shopping List</h1>
        {productsListInfo?.productsList?.length === 0 ? (
          <p>No items found in the shopping list.</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            {productsListInfo?.productsList?.map((item) => (
              <ShoppingItem
                key={item.id}
                params={item}
                categoryList={categoryList}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
