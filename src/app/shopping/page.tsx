"use client";

import { useEffect, useState, useCallback } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ShoppingListInfo {
  shoppingList?: ShoppingList;
  message?: string;
}

export default function Shopping() {
  // Router
  const router = useRouter();

  // State
  const [shoppingListInfo, setShoppingListInfo] =
    useState<ShoppingListInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchShoppingListInfo();
  }, [fetchShoppingListInfo]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!shoppingListInfo) {
    return <p>Error loading shopping list information.</p>;
  }

  return (
    <div>
      <h1>Welcome to Shopping</h1>
      <h2>name: {shoppingListInfo.shoppingList?.name}</h2>
      <h2>id: {shoppingListInfo.shoppingList?.id}</h2>
      <h2>familyId: {shoppingListInfo.shoppingList?.familyId}</h2>
    </div>
  );
}
