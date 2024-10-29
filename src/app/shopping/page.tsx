import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShoppingItem } from "./components/ShoppingItem/ShoppingItem";
import { ItemCategory } from "@prisma/client";

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

interface ShoppingListInfo {
  shoppingList?: ShoppingList;
  message?: string;
}

interface ProductsListInfo {
  productsList?: ShoppingItem[];
  message?: string;
}

/**
 * Get shopping list info (for list id purpose and checking connection)
 *
 * @param {string} cookies Next-auth session token
 * @returns {ShoppingListInfo} JSON with info or message if error
 */
async function getShoppingListData(cookie: string) {
  const res = await fetch(`${baseUrl}/api/shopping/`, {
    headers: { Cookie: cookie },
  });
  return res.json();
}

/**
 * Return array of categories with names and icons
 * @returns {ItemCategory[]} Array of categories
 */
async function getCategories() {
  const res = await fetch(`${baseUrl}/api/info/category`);
  const data = await res.json();

  return data.categoryList;
}

/**
 * Get all products from specific shopping list
 *
 * @param {string} cookie Next-auth session token
 * @param {string} shoppingListId Shopping list id
 * @returns {ProductsListInfo} JSON with info or message if error
 */
async function getProductListData(cookie: string, shoppingListId: string) {
  const res = await fetch(
    `${baseUrl}/api/shopping/products-list?shoppingListId=${shoppingListId}`,
    {
      headers: { Cookie: cookie },
      cache: "no-cache",
    }
  );
  return res.json();
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
            <ShoppingItem
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
