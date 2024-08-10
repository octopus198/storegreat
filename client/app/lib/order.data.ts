"use server";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from 'next/headers'

 type Order = {
  _id: string;
  customerId: Customer;
  amount: number;
  status: string;
  deletedAt: String;
  creation_date: Date;
};

type Customer = {
  name: string;
  _id: string;
}

export async function fetchOrderById(id:string) {
  noStore();
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/order/${id}`,
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
    const orderDetail = await response.json();
    console.log(orderDetail)
    
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
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    let filteredOrders = responseData.filter(
      (order: Order) => !order.deletedAt
    );

    filteredOrders = filteredOrders.sort((a: Order, b: Order) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());

    if (query) {
      const queriedOrders = filteredOrders.filter((order: Order) =>
        order.customerId.name.toLowerCase().includes(query.toLowerCase())
      );
      const displayedQueriedOrders = queriedOrders.slice(
        skip,
        skip + ITEMS_PER_PAGE
      );
      return displayedQueriedOrders;
    }

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
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const responseData = await response.json();
    console.log("fetchOrderItems",responseData);
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

