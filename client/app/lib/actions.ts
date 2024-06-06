"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

let accessToken = localStorage.getItem("accessToken");

const FormSchema = z.object({
  _id: z.string(),
  productName: z.string({
    required_error: "Product name is required",
  }),
  brand: z.string(),
  productDescription: z.string(),
  stockQuantity: z.coerce.number(),
  retailPrice: z.coerce
    .number()
    .gt(0, { message: "Please enter amount greater than 0" }),
  COGS: z.coerce
    .number()
    .gt(0, { message: "Please enter amount greater than 0" }),
  variants: z.string(),
  warehouse_enter_date: z.string(),
  exp_date: z.string(),
});

const CreateProduct = FormSchema.omit({ _id: true });
const UpdateProduct = FormSchema.omit({ _id: true });

export type State = {
  errors?: {
    productName?: string[];
    brand?: string[];
    productDescription?: string[];
    stockQuantity?: string[];
    retailPrice?: string[];
    COGS?: string[];
    variants?: string[];
    warehouse_enter_date?: string[];
    exp_date?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    productName: formData.get("productName"),
    brand: formData.get("brand"),
    productDescription: formData.get("productDescription"),
    stockQuantity: formData.get("stockQuantity"),
    retailPrice: formData.get("retailPrice"),
    COGS: formData.get("COGS"),
    variants: formData.get("variants"),
    warehouse_enter_date: formData.get("warehouse_enter_date"),
    exp_date: formData.get("exp_date"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
    };
  }

  validatedFields.data.retailPrice *= 100;
  validatedFields.data.COGS *= 100;
  const productData = validatedFields.data;

  try {
    const response = await fetch(
      "http://localhost:4000/dashboard/product/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Faile to upload new products");
    }

    const responseData = await response.json();
    console.log(responseData);
    if (!responseData || !responseData.product || !responseData.product._id) {
      throw new Error(
        "No response data or no responseData.product or no responseData.product._id"
      );
    }
    console.log("Product created successfully", responseData);
    
    // revalidatePath('/dashboard/product');
    // redirect('/dashboard/product');
  } catch (error) {
    // if (error instanceof Error) {
    //   console.error("Error creating product:", error.message);
    // } else {
    //   console.error("Unknown error:", error);
    // }
    return {
      message: 'Database Error: Failed to Create Product.'
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const validatedFields = UpdateProduct.safeParse({
    productName: formData.get("productName"),
    brandName: formData.get("brandName"),
    productDescription: formData.get("description"),
    retailPrice: formData.get("retailPrice"),
    COGS: formData.get("COGS"),
    stockQuantity: formData.get("warehouseQuantity"),
    warehouse_enter_date: formData.get("warehouseEnterDate"),
    exp_date: formData.get("expiryDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  validatedFields.data.retailPrice *= 100;
  validatedFields.data.COGS *= 100;
  const productData = validatedFields.data;

  try {
    console.log(accessToken);
    const response = await fetch(
      `http://localhost:4000/dashboard/product/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to update product details");
    }
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/dashboard/product/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Faile to delete product");
    }

    console.log(response);
    revalidatePath("/dashboard/product");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}


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

const CreateOrder = OrderFormSchema.omit({ _id: true });
const UpdateOrder = OrderFormSchema.omit({ _id: true });

export type OrderState = {
  errors?: {
    amount?: string[];
    status?: string[];
    date?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: OrderState, formData: FormData) {
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
      throw new Error("Faile to create new order");
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
