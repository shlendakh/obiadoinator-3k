// Simple fetcher
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Base url
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Get shopping list info (for list id purpose and checking connection)
 *
 * @param {string} cookies Next-auth session token
 * @returns {ShoppingListInfo} JSON with info or message if error
 */
export async function getShoppingListData(cookie: string) {
  const res = await fetch(`${baseUrl}/api/shopping/`, {
    headers: { Cookie: cookie },
  });
  return res.json();
}

/**
 * Return array of categories with names and icons
 * @returns {ItemCategory[]} Array of categories
 */
export async function getCategories() {
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
export async function getProductListData(
  cookie: string,
  shoppingListId: string
) {
  const res = await fetch(
    `${baseUrl}/api/shopping/products-list?shoppingListId=${shoppingListId}`,
    {
      headers: { Cookie: cookie },
      cache: "no-cache",
    }
  );
  return res.json();
}
