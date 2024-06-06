"use client";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

let accessToken = localStorage.getItem("accessToken");

const OrderFormSchema = z.object({
    _id: z.string(),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  });
  
  const CreateOrder = OrderFormSchema.omit({ _id: true, date: true });
  const UpdateOrder = OrderFormSchema.omit({ _id: true });
  
  export type OrderState = {
    errors?: {
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
  
  export async function createOrder(prevState: OrderState, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateOrder.safeParse({
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
  
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
  
    validatedFields.data.amount *= 100;
    const orderData = validatedFields.data;
  
    try {
      const response = await fetch(
        "http://localhost:4000/dashboard/order/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      console.log(response);
  
      if (!response.ok) {
        throw new Error("Failed to create new order");
      }
  
      const responseData = await response.json();
      console.log(responseData);
      if (!responseData || !responseData.product || !responseData.product._id) {
        throw new Error(
          "No response data or no responseData.product or no responseData.product._id"
        );
      }
      
      console.log("Order created successfully", responseData);
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

export async function deleteOrder(id: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/order/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Faile to delete order");
    }

    console.log(response);
    // revalidatePath("/dashboard/order");
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}


