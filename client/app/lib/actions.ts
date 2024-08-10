"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const FormSchema = z.object({
  _id: z.string(),
  productName: z
    .string()
    .trim()
    .min(1, { message: "Product name is required" })
    .refine(
      async (productName) => {
        const exists = await checkProductNameExists(productName);
        return !exists;
      },
      {
        message: "Product name already exists",
      }
    ),
  brand: z.string().optional().nullable(),
  imageURL: z.array(z.string()).optional().nullable(),
  productDescription: z.string().optional().nullable(),
  stockQuantity: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  retailPrice: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  COGS: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        variantName: z.string(),
        variantPrice: z.coerce
          .number()
          .gt(0, { message: "Please enter price greater than 0" }),
        variantQuantity: z.coerce
          .number()
          .gt(0, { message: "Please enter quantity greater than 0" }),
        variantCOGS: z.coerce
          .number()
          .gt(0, { message: "Please enter cost greater than 0" }),
      })
    )
    .optional(),
  warehouse_enter_date: z.string().optional().nullable(),
  exp_date: z.string().optional().nullable(),
  deletedAt: z.string(),
  creation_date: z.string(),
});

const FormUpdateSchema = z.object({
  _id: z.string(),
  productName: z
    .string()
    .trim()
    .min(1, { message: "Product name is required" }),
  brand: z.string().optional().nullable(),
  imageURL: z.array(z.string()).optional().nullable(),
  productDescription: z.string().optional().nullable(),
  stockQuantity: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  retailPrice: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  COGS: z.coerce
    .number()
    .gte(0, { message: "Please enter amount greater than 0" })
    .optional()
    .nullable(),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        variantName: z.string(),
        variantPrice: z.coerce
          .number()
          .gt(0, { message: "Please enter price greater than 0" }),
        variantQuantity: z.coerce
          .number()
          .gt(0, { message: "Please enter quantity greater than 0" }),
        variantCOGS: z.coerce
          .number()
          .gt(0, { message: "Please enter cost greater than 0" }),
      })
    )
    .optional(),
  warehouse_enter_date: z.string().optional().nullable(),
  exp_date: z.string().optional().nullable(),
  deletedAt: z.string(),
  creation_date: z.string(),
});

const UpdateProduct = FormUpdateSchema.omit({
  _id: true,
  deletedAt: true,
  creation_date: true,
});

const CreateProduct = FormSchema.omit({
  _id: true,
  deletedAt: true,
  creation_date: true,
});

export type State = {
  errors?: {
    productName?: string[];
    brand?: string[];
    imageURL?: string[];
    productDescription?: string[];
    stockQuantity?: string[];
    retailPrice?: string[];
    COGS?: string[];
    hasVariants?: string[];
    variants?: string[];
    warehouse_enter_date?: string[];
    exp_date?: string[];
  };
  message?: string | null;
};

async function checkProductNameExists(productName: string): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/new/isproductexists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify({ productName }), 
      }
    );
    console.log("the responses is ", response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error); 
    }

    const data: { exists: boolean } = await response.json();
    return data.exists;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to check product name");
    } else {
      throw new Error("Failed to check product name");
    }
  }
}

export async function createProduct(
  prevState: State,
  formData: FormData
): Promise<State> {
  // get images
  let imageUrls: string[] = [];
  const imageFiles = formData.getAll("image") as File[];
  console.log(" imageFiles", imageFiles);
  const validImageFiles = imageFiles.filter((file) => file.size > 0);

  console.log("valid imageFiles", validImageFiles);
  console.log("imageFiles length", imageFiles.length);
  if (validImageFiles.length !== 0) {
    const uploadResponse = await uploadImage(imageFiles);
    imageUrls = uploadResponse.files.map((file) => file.secure_url);
  }
  console.log(imageUrls);

  // get variants data
  const variantsData: {
    variantName: string;
    variantPrice: string;
    variantQuantity: string;
    variantCOGS: string;
  }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("variants")) {
      const index = key.replace("variants.", "");
      const field = parseInt(index);
      const prop = key.replace(`variants.${field}.`, "");
      if (!variantsData[field]) {
        variantsData[field] = {
          variantName: "",
          variantPrice: "",
          variantQuantity: "",
          variantCOGS: "",
        };
      }
      if (
        prop === "variantName" ||
        prop === "variantPrice" ||
        prop === "variantQuantity" ||
        prop === "variantCOGS"
      ) {
        variantsData[field][prop] = value.toString();
      }
    }
  }

  const variants = variantsData.map((variant) => ({
    variantName: variant.variantName,
    variantPrice: parseFloat(variant.variantPrice),
    variantQuantity: parseInt(variant.variantQuantity || "0"),
    variantCOGS: parseFloat(variant.variantCOGS),
  }));

  let isValidationSuccess = false;
  try {
    const validatedFields = await CreateProduct.parseAsync({
      productName: formData.get("productName"),
      brand: formData.get("brand"),
      imageURL: imageUrls,
      productDescription: formData.get("productDescription"),
      stockQuantity: formData.get("stockQuantity"),
      retailPrice: formData.get("retailPrice"),
      COGS: formData.get("COGS"),
      variants: variants,
      hasVariants: variants.length > 0 ? true : false,
      warehouse_enter_date: formData.get("warehouse_enter_date"),
      exp_date: formData.get("exp_date"),
    });

    isValidationSuccess = true;
    console.log("Parsing success");

    // get access token
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const responseData = await response.json();
    console.log("Product created successfully", responseData);

    return { message: "Product created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.flatten().fieldErrors);
      return {
        errors: error.flatten().fieldErrors,
        message: "Validation failed. Failed to create product.",
      };
    } else if (error instanceof Error) {
      console.error("Failed to create product:", error.message);
      return { message: error.message || "Failed to create product" };
    } else {
      console.error("Unknown error:", error);
      return { message: "An unknown error occurred" };
    }
  } finally {
    if (isValidationSuccess) {
      revalidatePath("/dashboard/product");
      redirect("/dashboard/product");
    }
  }
}

// Upload images onto cloudinary
interface UploadResponse {
  files: {
    secure_url: string;
  }[];
}

export async function uploadImage(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  // get access token
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/new/upload`,
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
    console.error("Error uploading images:", error);
    throw error;
  }
}

// update product
export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  // get images
  const imageFiles = formData.getAll("image") as File[];
  console.log("imageFiles in update", imageFiles);

  const variantsData: {
    variantName: string;
    variantPrice: string;
    variantQuantity: string;
    variantCOGS: string;
  }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("variants")) {
      const index = key.replace("variants.", "");
      const field = parseInt(index);
      const prop = key.replace(`variants.${field}.`, "");
      if (!variantsData[field]) {
        variantsData[field] = { variantName: "", variantPrice: "", variantQuantity: "", variantCOGS: "" };
      }
      if (
        prop === "variantName" ||
        prop === "variantPrice" ||
        prop === "variantQuantity" ||
        prop === "variantCOGS"
      ) {
        variantsData[field][prop] = value.toString();
      }
    }
  }
  console.log("variants data in update", variantsData);

  const variants = variantsData.map((variant) => ({
    variantName: variant.variantName,
    variantPrice: parseFloat(variant.variantPrice),
    variantQuantity: parseInt(variant.variantQuantity || "0"),
    variantCOGS: parseFloat(variant.variantCOGS),
  }));

  console.log("variants in update", variants);

  let isValidationSuccess = false;
  try {
    const validatedFields = await UpdateProduct.parseAsync({
      productName: formData.get("productName"),
      brand: formData.get("brand"),
      productDescription: formData.get("productDescription"),
      stockQuantity: formData.get("stockQuantity"),
      retailPrice: formData.get("retailPrice"),
      COGS: formData.get("COGS"),
      variants: variants,
      hasVariants: variants.length > 0 ? true : false,
      warehouse_enter_date: formData.get("warehouse_enter_date"),
      exp_date: formData.get("exp_date"),
    });

    isValidationSuccess = true;
    console.log("Parsing success");

    // get access token
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");

    // Perform API call to create product
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
        body: JSON.stringify(validatedFields),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to updated product");
    }

    const responseData = await response.json();
    console.log("Product updated successfully", responseData);

    return { message: "Product updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.flatten().fieldErrors);
      return {
        errors: error.flatten().fieldErrors,
        message: "Validation failed. Failed to updated product.",
      };
    } else if (error instanceof Error) {
      console.error("Failed to updated product:", error.message);
      return { message: error.message || "Failed to updated product" };
    } else {
      console.error("Unknown error:", error);
      return { message: "An unknown error occurred" };
    }
  } finally {
    if (isValidationSuccess) {
      revalidatePath("/dashboard/product");
      redirect("/dashboard/product");
    }
  }
}

// delete product
export async function deleteProduct(id: string) {
  // get access token
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/product/delete/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Fail to delete product");
    }

    console.log("the delete product response is",response);
    revalidatePath("/dashboard/product");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
