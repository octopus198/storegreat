"use client";
import { Order, OrdersTable } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import Router, { useRouter } from "next/router";

let accessToken = localStorage.getItem("accessToken");

export async function fetchOrderById(id:string) {
  noStore();
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/order/${id}`,
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
    const orderDetail = await response.json();
    console.log(orderDetail)
    // const productDetailData = productDetail.map((product: Product) => ({
    //   ...product,
    //   // Convert amount from cents to dollars
    //   retailPrice: (product.retailPrice as number) / 100,
    //   COGS: (product.COGS as number) / 100,
    // }));
    
    return orderDetail;
  } catch (err) {
    console.log(err);
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredOrders(
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

    const response = await fetch("http://localhost:4000/dashboard/order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    let filteredOrders = responseData.filter(
      (order: Order) => !order.deletedAt
    );

    filteredOrders = filteredOrders.sort((a: Order, b: Order) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
    console.log("Get orders successfully", responseData);
    console.log("filtered orders", filteredOrders);
    // if (query) {
    //   const queriedProducts = filteredOrders.filter((order: Order) =>
    //     order.orderName.toLowerCase().includes(query.toLowerCase())
    //   );
    //   const displayedQueriedProducts = queriedProducts.slice(
    //     skip,
    //     skip + ITEMS_PER_PAGE
    //   );
    //   return displayedQueriedProducts;
    // }

    const displayedOrders = filteredOrders.slice(
      skip,
      skip + ITEMS_PER_PAGE
    );
    return displayedOrders;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function fetchOrderItems(query: string) {
  noStore();
  try {
    if (!accessToken) {
      console.log("we have access token here");
      //   router.push("/login");
      return;
    }

    const response = await fetch("http://localhost:4000/dashboard/order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    const filteredOrders = responseData.filter(
      (order: Order) => !order.deletedAt
    );

    const totalItems = filteredOrders ? filteredOrders.length : 0;
    return totalItems;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of orders.");
  }
}

