"use client";
import { TextField, TextArea, Grid, Box, Spinner } from "@radix-ui/themes";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../buttons";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/lib/actions";
import { useWatch, Control, useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";

interface Product {
  _id: string;
  imageURL: [string];
  productName: string;
  retailPrice: number;
  COGS: number;
  deletedAt: string | null;
  creation_date: Date;
  brand: string;
  productDescription: string;
  stockQuantity: number;
  warehouse_enter_date: string;
  exp_date: string;
  variants: [Variant];
}

interface Variant {
  variantName: string;
  variantPrice: number;
  variantQuantity: number;
  variantCOGS: number;
}

type FormValues = {
  variants: {
    variantName: string;
    variantPrice: number;
    variantQuantity: number;
    variantCOGS: number;
  }[];
};

function getTotal(payload: FormValues["variants"]) {
  if (!payload) return 0;
  let total = 0;
  for (const item of payload) {
    total =
      total + (Number.isNaN(item.variantQuantity) ? 0 : item.variantQuantity);
  }
  return total;
}

function TotalQuantity({ control }: { control: Control<FormValues> }) {
  const variant = useWatch({
    control,
    name: "variants",
  });

  return (
    <p className="text-zinc-700 font-semibold">
      Total Quantity: {getTotal(variant)}
    </p>
  );
}
export default function Form({ productDetail }: { productDetail: Product }) {
  const initialState = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, productDetail._id);
  const [state, dispatch] = useFormState(updateProductWithId, initialState);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      variants: productDetail.variants,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });

  return (
    <form action={dispatch} className="space-y-5">
      <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="productName"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product name
          </label>
          <TextField.Root
            id="productName"
            name="productName"
            placeholder="Product name"
            defaultValue={productDetail.productName}
          ></TextField.Root>
        </div>
        <div id="product-error" aria-live="polite" aria-atomic="true">
          {state.errors?.productName &&
            state.errors.productName.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="brandName"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Brand name
          </label>
          <TextField.Root
            id="brand"
            name="brand"
            placeholder="Brand name"
            defaultValue={productDetail.brand}
          ></TextField.Root>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Description
          </label>
          <TextArea
            id="productDescription"
            name="productDescription"
            rows={10}
            placeholder="Product Description"
            defaultValue={productDetail.productDescription}
          />
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="variant"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Variants
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-4">
              <label htmlFor="">
                Variant Name
                <input
                  id="variant"
                  placeholder="Variant Name"
                  {...register(`variants.${index}.variantName`, {
                    required: true,
                  })}
                  // defaultValue={field.variantName}
                  // onChange={(e) => handleUpdate(index, 'variantName', e.target.value)}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="">
                Variant Price
                <input
                  type="number"
                  placeholder="Variant Price"
                  // defaultValue={field.variantPrice}
                  {...register(`variants.${index}.variantPrice`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  // onChange={(e) => handleUpdate(index, 'variantPrice', e.target.value)}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="" className="mb-2">
                Variant Quantity
                <input
                  type="number"
                  // defaultValue={field.variantQuantity}
                  placeholder="Variant Quantity"
                  {...register(`variants.${index}.variantQuantity`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  // onChange={(e) => handleUpdate(index, 'variantQuantity', e.target.value)}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="" className="mb-2">
                Variant Cost
                <input
                  // defaultValue={field.variantCOGS}
                  type="number"
                  placeholder="Variant Cost"
                  {...register(`variants.${index}.variantCOGS`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                variantName: "",
                variantPrice: 0,
                variantQuantity: 0,
                variantCOGS: 0,
              })
            }
          >
            Add Variant
          </Button>
        </div>
        <TotalQuantity control={control} />
      </div>
      {state.errors?.variants &&
        state.errors.variants.map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}

      {/* IMAGE SECTION */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="imageInput"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Image
          </label>
          
          <div className="flex space-x-4 overflow-x-auto">
            {productDetail.imageURL &&
              productDetail.imageURL.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product Image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ))}
          </div>
        </div>
      </div>

      {/* QUANTITY SECTION */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="warehouseQuantity"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Quantity in warehouse
          </label>
          <input
            defaultValue={productDetail.stockQuantity}
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="retailPrice"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Retail price
          </label>
          <input
            defaultValue={productDetail.retailPrice}
            id="retailPrice"
            name="retailPrice"
            type="number"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="COGS"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Cost of goods sold
          </label>
          <input
            defaultValue={productDetail.COGS}
            id="COGS"
            name="COGS"
            type="number"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="warehouseEnterDate"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Warehouse enter date
          </label>
          <input
            defaultValue={
              new Date(productDetail.warehouse_enter_date)
                .toISOString()
                .split("T")[0]
            }
            id="warehouse_enter_date"
            name="warehouse_enter_date"
            type="date"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expiryDate"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Expiry date
          </label>
          <input
            defaultValue={
              new Date(productDetail.exp_date).toISOString().split("T")[0]
            }
            id="exp_date"
            name="exp_date"
            type="date"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/product"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <UpdateProductButton/>
      </div>
    </form>
  );
}

function UpdateProductButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-400"
      aria-disabled={pending}
    >
      {pending? <Spinner />: " "} Update Product
    </Button>
  );
}
