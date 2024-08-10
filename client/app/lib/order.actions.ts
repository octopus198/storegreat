"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const VariantSchema = z.object({
  variantId: z.string().nullable(),
  productId: z.string().min(1, { message: "Product cannot be empty." }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be greater than 0." }),
});

const OrderFormSchema = z.object({
  _id: z.string(),
  customerId: z.string({
    invalid_type_error: "Customer is required",
  }),
  products: z
    .array(VariantSchema)
    .min(1, { message: "At least one product is required." }),
  amount: z.coerce.number().gte(0),
  cost: z.coerce.number().gte(0),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an order status.",
  }),
  deletedAt: z.string(),
  creation_date: z.string(),
});

const CreateOrder = OrderFormSchema.omit({
  _id: true,
  deletedAt: true,
  creation_date: true,
});
const UpdateOrder = OrderFormSchema.omit({
  _id: true,
  deletedAt: true,
  creation_date: true,
});

export type State = {
  errors?: {
    customerId?: string[];
    products?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createOrder(
  prevState: State,
  formData: FormData
): Promise<State> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  // get the products data
  const productsData: {
    variantId: string;
    productId: string;
    quantity: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("product")) {
      const [_, index, prop] = key.split(".");
      const field = parseInt(index);
      if (!productsData[field]) {
        productsData[field] = {
          variantId: "",
          productId: "",
          quantity: "",
        };
      }
      if (prop === "variantId") {
        productsData[field]["variantId"] = value.toString();
      } else if (prop === "quantity") {
        productsData[field]["quantity"] = value.toString();
      }
    }
  }

  const products = productsData.map((product) => {
    const { variantId, productId } = product;
    const [parsedProductId, parsedVariantId] = variantId.split("|");
    console.log("parsed product id is", parsedProductId);
    console.log("parsed variant id is", parsedVariantId);
    return {
      productId: parsedProductId,
      variantId: parsedVariantId ? parsedVariantId : null,
      quantity: parseInt(product.quantity || "0"),
    };
  });

  // Validate form fields using Zod
  const validatedFields = CreateOrder.safeParse({
    amount: formData.get("amount"),
    cost: formData.get("cost"),
    status: formData.get("status"),
    customerId: formData.get("customerId"),
    products: products,
  });

  console.log("validatedFields data", validatedFields.data);

  if (!validatedFields.success) {
    console.log("not success");
    console.log("flatten errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Order.",
    };
  }

  console.log("order data is ", validatedFields.data);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/order/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
      body: JSON.stringify(validatedFields.data),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to create new order");
    }

    const responseData = await response.json();
    console.log("Order created successfully", responseData);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/order");
  redirect("/dashboard/order");
}

export async function updateOrder(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  // get the products data
  const productsData: {
    variantId: string;
    productId: string;
    quantity: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("product")) {
      const [_, index, prop] = key.split(".");
      const field = parseInt(index);
      if (!productsData[field]) {
        productsData[field] = {
          variantId: "",
          productId: "",
          quantity: "",
        };
      }
      if (prop === "variantId") {
        productsData[field]["variantId"] = value.toString();
      } else if (prop === "quantity") {
        productsData[field]["quantity"] = value.toString();
      }
    }
  }

  const products = productsData.map((product) => {
    const { variantId, productId } = product;
    const [parsedProductId, parsedVariantId] = variantId.split("|");
    console.log("parsed product id is", parsedProductId);
    console.log("parsed variant id is", parsedVariantId);
    return {
      productId: parsedProductId,
      variantId: parsedVariantId ? parsedVariantId : null,
      quantity: parseInt(product.quantity || "0"),
    };
  });

  // Validate form fields using Zod
  const validatedFields = CreateOrder.safeParse({
    amount: formData.get("amount"),
    cost: formData.get("cost"),
    status: formData.get("status"),
    customerId: formData.get("customerId"),
    products: products,
  });

  console.log("validatedFields data", validatedFields.data);

  if (!validatedFields.success) {
    console.log("not success");
    console.log("flatten errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Order.",
    };
  }

  console.log("order data is ", validatedFields.data);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/order/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields.data),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to create new order");
    }

    const responseData = await response.json();
    console.log("Order created successfully", responseData);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/order");
  redirect("/dashboard/order");
}

export async function deleteOrder(id: string) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/order/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Faile to delete order");
    }

    console.log(response);
    revalidatePath("/dashboard/order");
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}
