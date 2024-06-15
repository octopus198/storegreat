import {z} from 'zod'
export type Product = {
  _id: string;
  productName: String;
  productDescription: String;
  brand: String;
  imageURL: [String];
  stockQuantity: Number;
  retailPrice: Number;
  COGS: Number;
  variants: string;
  warehouse_enter_date: Date;
  exp_date: Date;
  deletedAt: String;
  creation_date: Date;
};


export type ProductsTable = {
  _id: string;
  productName: string;
  imageURL: string;
  retailPrice: number;
  COGS: number;
  amount: number;
};

export type ProductForm = {
  _id: string;
  productName: String;
  productDescription: String;
  brand: String;
  imageURL: [String];
  stockQuantity: Number;
  retailPrice: Number;
  COGS: Number;
  variants: [String];
  warehouse_enter_date: Date;
  exp_date: Date;
  deletedAt: String;
  creation_date: Date;
};

export type Order = {
  _id: string;
  customer_id: string;
  amount: number;
  status: string;
  deletedAt: String;
  creation_date: Date;
};


export type OrdersTable = {
  _id: string;
  customer_id: string;
  amount: number;
  status: string;
  deletedAt: String;
  creation_date: Date;
};

export type Customer = {
  _id: string;
  name: string;
  image: string;
  deletedAt: String;
  creation_date: Date;
};

export type CustomersTable = {
  _id: string;
  name: string;
  image: string;
  deletedAt: String;
  creation_date: Date;
};

export type CustomerField = {
  _id: string;
  name: string;
};

export type Variant = {
  _id: string;
  variantName: string;
  variantQuantity: number;
  variantPrice: number;
  variantCOGS: number;
}
export type ProductField = {
  _id: string;
  productName: string;
  variants: [Variant];
  stockQuantity: number;
  retailPrice: number;
  COGS: number;
};

export type ProductsField = {
  _id: string;
  productName: string;
  variants: [Variant];
  stockQuantity: number;
  retailPrice: number;
  COGS: number;
};

export type User = {
  _id: string;
  email: string;
  password: string;
};

 export const FormSchema = z.object({
  _id: z.string(),
  productName: z.string({
    required_error: "Product name is required",
    invalid_type_error: "Product name is required",
  }),
  brand: z.string(),
  imageURL: z.array(z.string()),
  productDescription: z.string(),
  stockQuantity: z.coerce.number(),
  retailPrice: z.coerce
    .number()
    .gt(0, { message: "Please enter amount greater than 0" }),
  COGS: z.coerce
    .number()
    .gt(0, { message: "Please enter amount greater than 0" }),
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
  warehouse_enter_date: z.string(),
  exp_date: z.string(),
  deletedAt: z.string(),
  creation_date: z.string(),
});