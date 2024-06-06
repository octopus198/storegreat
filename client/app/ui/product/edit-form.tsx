"use client";
import { TextField, TextArea, Grid, Box } from "@radix-ui/themes";
import { useFormState } from "react-dom";
import { Button } from "../buttons";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/lib/actions";
import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import "rsuite/Uploader/styles/index.css";
import { CameraIcon } from "@heroicons/react/24/outline";
import { ProductForm } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";

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
}
export default function Form({ productDetail }: { productDetail: Product }) {
  const initialState = { message: null, errors: {} };
  console.log(productDetail);
  const updateProductWithId = updateProduct.bind(null, productDetail._id);
  //   const [state, dispatch] = useFormState(updateProductWithId, initialState);

  return (
    <form action={updateProductWithId} className="space-y-5">
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

        <div className="space-y-2">
          <label
            htmlFor="brandName"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Brand name
          </label>
          <TextField.Root
            id="brandName"
            name="brandName"
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
            id="description"
            name="description"
            rows={10}
            placeholder="Product Description"
            defaultValue={productDetail.productDescription}
          />
        </div>
      </div>

      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="imageInput"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Image
          </label>
          <Uploader
            multiple
            listType="picture"
            action="//jsonplaceholder.typicode.com/posts/"
          >
            <button>
              <CameraIcon />
            </button>
          </Uploader>
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
            id="warehouseQuantity"
            name="warehouseQuantity"
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
            htmlFor="variants"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Variants
          </label>
          <input
            id="variants"
            name="variants"
            type="text"
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
            defaultValue={new Date(productDetail.warehouse_enter_date).toISOString().split('T')[0]}
            id="warehouseEnterDate"
            name="warehouseEnterDate"
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
            defaultValue={new Date(productDetail.exp_date).toISOString().split('T')[0]}
            id="expiryDate"
            name="expiryDate"
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
        <Button type="submit">Update Product</Button>
      </div>
    </form>
  );
}
