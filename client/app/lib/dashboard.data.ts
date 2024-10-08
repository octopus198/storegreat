"use server";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { Order } from "./definitions";

export async function fetchCardData() {
  noStore();
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken?.value}`,
    };

    const urls = [
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/getsales`,
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/getcost`,
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/productsold`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: headers,
      }).then((response) => response.json())
    );

    const responses = await Promise.all(requests);

    const [totalSalesData, totalCostData, productSoldData] = responses;

    const totalSales = totalSalesData.sales;
    const totalCost = totalCostData.cost;
    const productSold = productSoldData.productsSold;

    const totalProfit = totalSales - totalCost;
    return {
      totalSales,
      totalCost,
      totalProfit,
      productSold,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

type RevenueChartDataItem = {
  monthYear: string;
  totalSales: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function fetchRevenueData() {
  noStore();
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/revenuedata`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch revenue data");
    }

    const responseData = await response.json();

    responseData.revenueChartData.sort(
      (a: RevenueChartDataItem, b: RevenueChartDataItem) => {
        // Extract month and year from monthYear strings
        const [monthA, yearA] = a.monthYear.split("/");
        const [monthB, yearB] = b.monthYear.split("/");

        // Compare years first in ascending order
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        } else {
          // If years are the same, compare months in ascending order
          return parseInt(monthA) - parseInt(monthB);
        }
      }
    );

    const formattedData = responseData.revenueChartData.map(
      (item: RevenueChartDataItem) => {
        const [month, year] = item.monthYear.split("/");
        const monthName = monthNames[parseInt(month) - 1]; // Convert month number to month name
        return {
          ...item,
          monthYear: `${monthName} ${year}`, // Format as "Month Year"
        };
      }
    );

    return formattedData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestOrders() {
  noStore();
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/latestorder`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );
    const responseData = await response.json();
    const filteredOrders = responseData.filter(
      (order: Order) => !order.deletedAt
    );

    return filteredOrders;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of orders.");
  }
}

export async function fetchUser() {
  noStore();
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getme`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}
