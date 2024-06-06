export type Product = {
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
  amount: Number;
  deletedAt: String;
  creation_date: Date;
};

export type OrdersTable = {
  _id: string;
  amount: Number;
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
