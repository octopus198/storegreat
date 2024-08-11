"use server"
import { Product } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from 'next/headers'

// this api return the product by id
export async function fetchProductById(id:string) {
  noStore();

    // get access token
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get product details");
    }
    const productDetail = await response.json();
    return productDetail;
  } catch (err) {
    console.log(err);
  }
}

// this api return the available products displayed for each page with search term
const ITEMS_PER_PAGE = 10;
export async function fetchFilteredProducts(
  query: string,
  currentPage: number
) {
  noStore();
    // get access token
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    if (!accessToken) {
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    const responseData = await response.json();

    let filteredProducts = responseData.filter(
      (product: Product) => !product.deletedAt
    );

    filteredProducts = filteredProducts.sort((a: Product, b: Product) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
   
    if (query) {
      const queriedProducts = filteredProducts.filter((product: Product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
      const displayedQueriedProducts = queriedProducts.slice(
        skip,
        skip + ITEMS_PER_PAGE
      );
      return displayedQueriedProducts;
    }

    const displayedProducts = filteredProducts.slice(
      skip,
      skip + ITEMS_PER_PAGE
    );
    return displayedProducts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products");
  }
}

// this api return the number of available products
export async function fetchProductItems(query: string) {
  noStore();

    // get access token
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')
  try {
    if (!accessToken) {
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const responseData = await response.json();

    const filteredProducts = responseData.filter(
      (product: Product) => !product.deletedAt
    );

    const totalItems = filteredProducts ? filteredProducts.length : 0;
    return totalItems;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of products.");
  }
}

// this api returns the available products
export async function fetchProducts() {
  noStore();
    // get access token
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')

  try {
    if (!accessToken) {
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const responseData = await response.json();
    const filteredProducts = responseData.filter(
      (product: Product) => !product.deletedAt
    );
    return filteredProducts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products.");
  }
}

