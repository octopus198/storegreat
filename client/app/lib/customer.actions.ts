"use client";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

let accessToken = localStorage.getItem("accessToken");

const CustomerFormSchema = z.object({
    _id: z.string(),
    name: z.string(),
    image: z.string(),
    creation_date: z.string(),
  });
  
  const CreateCustomer = CustomerFormSchema.omit({ _id: true });
  const UpdateCustomer = CustomerFormSchema.omit({ _id: true });
  
  export type CustomerState = {
    errors?: {
      name?: string[];
      image?: string[];
      creation_date?: string[];
    };
    message?: string | null;
  };
  
  export async function createCustomer(prevState: CustomerState, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateCustomer.safeParse({
      name: formData.get('name'),
      image: formData.get('image'),
    });
  
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Customer.',
      };
    }
  
    const customerData = validatedFields.data;
  
    try {
      const response = await fetch(
        "http://localhost:4000/dashboard/customer/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(customerData),
        }
      );
      console.log(response);
  
      if (!response.ok) {
        throw new Error("Faile to create new customer");
      }
  
      const responseData = await response.json();
      console.log(responseData);
      if (!responseData || !responseData.product || !responseData.product._id) {
        throw new Error(
          "No response data or no responseData.product or no responseData.product._id"
        );
      }
      
      console.log("Customer created successfully", responseData);
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Product.'
      };
    }
  
    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    // redirect('/dashboard/invoices');
  }
  

// export async function updateProduct(id: string, formData: FormData) {
//   const validatedFields = UpdateProduct.safeParse({
//     productName: formData.get("productName"),
//     brandName: formData.get("brandName"),
//     productDescription: formData.get("description"),
//     retailPrice: formData.get("retailPrice"),
//     COGS: formData.get("COGS"),
//     stockQuantity: formData.get("warehouseQuantity"),
//     warehouse_enter_date: formData.get("warehouseEnterDate"),
//     exp_date: formData.get("expiryDate"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields. Failed to Create Invoice.",
//     };
//   }

//   validatedFields.data.retailPrice *= 100;
//   validatedFields.data.COGS *= 100;
//   const productData = validatedFields.data;

//   try {
//     console.log(accessToken);
//     const response = await fetch(
//       `http://localhost:4000/dashboard/product/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(productData),
//       }
//     );
//     console.log(response);

//     if (!response.ok) {
//       throw new Error("Failed to update product details");
//     }
//     console.log("Product updated successfully");
//   } catch (error) {
//     console.error("Error updating product:", error);
//   }
// }

export async function deleteCustomer(id: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/customer/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete customer");
    }

    console.log(response);
    // revalidatePath("/dashboard/customer");
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}


