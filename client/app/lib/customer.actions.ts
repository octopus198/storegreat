"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { cookies } from "next/headers";

const CustomerFormSchema = z.object({
  _id: z.string(),
  name: z.string().trim().min(1, { message: "Customer name is required" }),
  image: z.string().optional(),
  creation_date: z.string(),
});

const CreateCustomer = CustomerFormSchema.omit({
  _id: true,
  creation_date: true,
});
const UpdateCustomer = CustomerFormSchema.omit({
  _id: true,
  creation_date: true,
});

export type State = {
  errors?: {
    name?: string[];
    image?: string[];
  };
  message?: string | null;
};

export async function createCustomer(
  prevState: State,
  formData: FormData
): Promise<State> {
  const imageFile = formData.get("image") as File;
  console.log(imageFile)
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const uploadResponse = await uploadImage(imageFile);
    imageUrl = uploadResponse.secure_url;
  }

  console.log(imageUrl);

  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    image: imageUrl,
  });
  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    console.log("not success");
    console.log("flatten errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  console.log("parsing success");

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  // const customerData = CreateCustomer.parse({
  //   name: formData.get("name"),
  //   image: imageUrl,
  // });
  try {
    const response = await fetch(
      "http://localhost:4000/dashboard/customer/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields.data),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Faile to create new customer");
    }

    const responseData = await response.json();

    console.log("Customer created successfully", responseData);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/customer");
  redirect("/dashboard/customer");
}

export async function uploadImage(file: File): Promise<{ secure_url: string }> {
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData);

  // get access token
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    const response = await fetch(
      "http://localhost:4000/dashboard/customer/new/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: formData,
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(
        `Failed to upload image: ${response.status} - ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("the data is ", data);
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
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
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const response = await fetch(
      `http://localhost:4000/dashboard/customer/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
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
