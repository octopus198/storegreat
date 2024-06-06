"use client";
import { Product, ProductsTable } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import Router, { useRouter } from "next/router";
import { number } from "zod";

let accessToken = localStorage.getItem("accessToken");
// const router = useRouter();

export async function fetchProductById(id:string) {
  noStore();
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/product/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get product details");
    }
    const productDetail = await response.json();
    console.log(productDetail)
    // const productDetailData = productDetail.map((product: Product) => ({
    //   ...product,
    //   // Convert amount from cents to dollars
    //   retailPrice: (product.retailPrice as number) / 100,
    //   COGS: (product.COGS as number) / 100,
    // }));
    
    return productDetail;
  } catch (err) {
    console.log(err);
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredProducts(
  query: string,
  currentPage: number
) {
  noStore();
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    if (!accessToken) {
      console.log("we have access token here");
      //   router.push("/login");
      return;
    }

    const response = await fetch("http://localhost:4000/dashboard/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // if response is 403 (invalid token) call the custom hook to get new refresh token
    // if (!response.ok) {
    //   if (response.status === 403) {
    //     console.log("before using hook", response);
    //     updateTokens(refreshToken);
    //     setRetryToggle((retryToggle) => !retryToggle);
    //     return;
    //   } else {
    //     throw new Error("Failed to get products");
    //   }
    // }

    const responseData = await response.json();
    console.log(responseData);
    let filteredProducts = responseData.filter(
      (product: Product) => !product.deletedAt
    );

    filteredProducts = filteredProducts.sort((a: Product, b: Product) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
    console.log("Get products successfully", responseData);
    console.log("filtered products", filteredProducts);
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

export async function fetchProductItems(query: string) {
  noStore();
  try {
    if (!accessToken) {
      console.log("we have access token here");
      //   router.push("/login");
      return;
    }

    const response = await fetch("http://localhost:4000/dashboard/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseData = await response.json();
    console.log(responseData);
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

