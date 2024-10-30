import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShoppingItemRow } from "./components/ShoppingItemRow/ShoppingItemRow";
import { ItemCategory, ShoppingList, ShoppingItem } from "@prisma/client";

import {
  getShoppingListData,
  getCategories,
  getProductListData,
} from "@/lib/functions";

interface ShoppingListInfo {
  shoppingList?: ShoppingList;
  message?: string;
}

interface ProductsListInfo {
  productsList?: ShoppingItem[];
  message?: string;
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  // If not logged redirect for sign in
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch cookie as string
  const cookie = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // Fetch initial data async
  const [shoppingListInfo, categories]: [ShoppingListInfo, ItemCategory[]] =
    await Promise.all([getShoppingListData(cookie), getCategories()]);

  // Return shopping list message if there's any
  if (shoppingListInfo.message) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Shopping List</h1>
        <p>{shoppingListInfo.message}</p>
      </div>
    );
  }

  // Return error if there's not any id in shopping list info
  if (!shoppingListInfo.shoppingList?.id) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Shopping List</h1>
        <p>Some problem fetching shopping list ID</p>
      </div>
    );
  }

  // Fetch list of products for user list
  const productsList: ProductsListInfo = await getProductListData(
    cookie,
    shoppingListInfo.shoppingList.id
  );

  let products: ShoppingItem[] | undefined = undefined;

  // Handle error from fetching products list
  if (productsList.message) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Shopping List</h1>
        <p>{productsList.message}</p>
      </div>
    );
  } else {
    products = productsList.productsList;
  }

  // Main render
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Shopping List</h1>
      {products?.length ? (
        <div className="flex flex-col items-center justify-center gap-2">
          {products.map((item) => (
            <ShoppingItemRow
              key={item.id}
              params={item}
              categoryList={categories}
            />
          ))}
        </div>
      ) : (
        <p>No items found in the shopping list.</p>
      )}
    </div>
  );
}
