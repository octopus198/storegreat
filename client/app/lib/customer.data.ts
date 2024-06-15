"use server";
import { Customer, CustomersTable } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import Router, { useRouter } from "next/router";
import { cookies } from "next/headers";


export async function fetchCustomerById(id:string) {
  noStore();
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/customer/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get customer details");
    }
    const customerDetail = await response.json();
    console.log(customerDetail)
    return customerDetail;
  } catch (err) {
    console.log(err);
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  noStore();
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const response = await fetch("http://localhost:4000/dashboard/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    let filteredCustomers = responseData.filter(
      (customer: Customer) => !customer.deletedAt
    );

    filteredCustomers = filteredCustomers.sort((a: Customer, b: Customer) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());
    console.log("Get customers successfully", responseData);
    console.log("filtered customers", filteredCustomers);
    if (query) {
      const queriedProducts = filteredCustomers.filter((customer: Customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase())
      );
      const displayedQueriedProducts = queriedProducts.slice(
        skip,
        skip + ITEMS_PER_PAGE
      );
      return displayedQueriedProducts;
    }

    const displayedCustomers = filteredCustomers.slice(
      skip,
      skip + ITEMS_PER_PAGE
    );
    return displayedCustomers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function fetchCustomerItems(query: string) { // this is to fetch pages 
  noStore();
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  try {
    if (!accessToken) {
      console.log("we have access token here");
      //   router.push("/login");
      return;
    }

    const response = await fetch("http://localhost:4000/dashboard/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    const filteredCustomers = responseData.filter(
      (customer: Customer) => !customer.deletedAt
    );

    const totalItems = filteredCustomers ? filteredCustomers.length : 0;
    return totalItems;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of customers.");
  }
}

export async function fetchCustomers() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  try {
    const response = await fetch("http://localhost:4000/dashboard/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    let filteredCustomers = responseData.filter(
      (customer: Customer) => !customer.deletedAt
    );

    filteredCustomers = filteredCustomers.sort((a: Customer, b: Customer) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime());    
    return filteredCustomers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}