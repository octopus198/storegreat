"use client";
import { TextField, TextArea, Grid, Box } from "@radix-ui/themes";
import { useFormState } from 'react-dom';
import { Button } from "../buttons";
import Link from "next/link";
import { createProduct } from "@/app/lib/actions";
import { Uploader } from "rsuite";
import "rsuite/Uploader/styles/index.css";
import { CameraIcon } from "@heroicons/react/24/outline";
import { type State } from '@/app/lib/actions';

export default function Form() {
  const initialState = { message: null, errors: {} };
const [state, dispatch] = useFormState(createProduct, initialState);

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
          aria-describedby="customer-error"
            id="productName"
            name="productName"
            placeholder="Product name"
          ></TextField.Root>
        </div>
        <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.productName &&
          state.errors.productName.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

        <div className="space-y-2">
          <label
            htmlFor="brand"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Brand name
          </label>
          <TextField.Root
            id="brand"
            name="brand"
            placeholder="Brand name"
          ></TextField.Root>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="productDescription"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Description
          </label>
          <TextArea
            id="productDescription"
            name="productDescription"
            rows={10}
            placeholder="Product Description"
          />
        </div>
      </div>
      
      {/* IMAGE UPLOAD */}
      {/* <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
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
      </div> */}


      {/* QUANTITY SECTION */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="stockQuantity"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Quantity in warehouse
          </label>
          <input
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
            htmlFor="warehouse_enter_date"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Warehouse enter date
          </label>
          <input
            id="warehouse_enter_date"
            name="warehouse_enter_date"
            type="date"
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="exp_date"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Expiry date
          </label>
          <input
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
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}



{/* IMAGE UPLOAD SECTION */}
      {/* {imageURL.length > 0 && (
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="imageInput"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Image
          </label>
          <Grid columns="4" gap="3" rows="repeat(2, 100px)" width="auto">
            <Box
              gridColumn="1 / 3"
              gridRow="1 / 3"
              className="rounded-md bg-zinc-100 "
              style={{ overflow: "hidden" }}
            >
              <img
                src={imageURL[0]}
                alt="Product Image"
                className="w-full h-full rounded-md object-contain"
              />
            </Box>
            {imageURL.slice(1).map((url, index) => (
              <Box
                key={index + 1}
                className="rounded-md bg-zinc-100"
                style={{ overflow: "hidden" }}
              >
                <img
                  src={url}
                  alt={`Product Image ${index + 2}`}
                  className="w-full h-full object-contain rounded-md"
                />
              </Box>
            ))}
            {imageURL.length < 5 && (
              <Box
                className="rounded-md bg-zinc-100"
                style={{ overflow: "hidden" }}
              >
                <div className="flex items-center justify-center w-full h-full rounded-md hover:bg-zinc-100 border-dotted border-2 border-zinc-200">
                  <Button type="button" onClick={handleUploadButtonClick}>
                    Upload image
                  </Button>
                  <input
                    type="file"
                    id="imageInput"
                    name="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </Box>
            )}
          </Grid>
        </div>
      </div>
    )}

    {imageURL.length === 0 && (
      <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="imageInput"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Image
          </label>
          <div className="flex items-center justify-center w-full h-32 rounded-md hover:bg-zinc-100 border-dotted border-2 border-zinc-200">
            <Button type="button" onClick={handleUploadButtonClick}>
              Upload image
            </Button>
            <input
              type="file"
              id="imageInput"
              name="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    )} */}