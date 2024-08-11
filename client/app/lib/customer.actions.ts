"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  image: true
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
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const uploadResponse = await uploadImage(imageFile);
    imageUrl = uploadResponse.secure_url;
  }

  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    image: imageUrl,
  });

  if (!validatedFields.success) {
    console.log("flatten errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/customer/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields.data),
      }
    );

    if (!response.ok) {
      throw new Error("Faile to create new customer");
    }
    const responseData = await response.json();
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
  const formData = new FormData();
  formData.append("file", file);

  // get access token
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/customer/new/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to upload image: ${response.status} - ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/customer/${id}`,
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
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData,

): Promise<State> {

  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/customer/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields.data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update customer");
    }
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/customer");
  redirect("/dashboard/customer");
}
