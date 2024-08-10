"use client";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { TextField, TextArea, Grid, Box, Spinner } from "@radix-ui/themes";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../buttons";
import Link from "next/link";
import { createProduct, State, uploadImage } from "@/app/lib/actions";
import { useState, ChangeEvent } from "react";
import { Uploader } from "rsuite";
import "rsuite/Uploader/styles/index.css";
import { red } from "tailwindcss/colors";

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

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createProduct, initialState);
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 5) {
      alert("You can only upload up to 5 images in one upload.");
      event.target.value = "";
      setImages([]);
      return;
    }

    // Read and store image files
    const imageUrls = files.map((file) => {
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          } else {
            reject("Error reading file");
          }
        };
        reader.onerror = () => {
          reject("Error reading file");
        };
        reader.readAsDataURL(file);
      });
    });

    // Update state with new images
    Promise.all(imageUrls)
      .then((results) => {
        setImages(results);
      })
      .catch((error) => alert(error));
  };

  // dynamic form fields
  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>();

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
            Product name <span style={{ color: "red" }}>*</span>
          </label>
          <TextField.Root
            aria-describedby="product-error"
            id="productName"
            name="productName"
            placeholder="Product name"
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
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Product Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            multiple
            onChange={handleImageUpload}
          />

          <div className="flex space-x-4 overflow-x-auto">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Uploaded ${index}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ))}
          </div>
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
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="">
                Variant Price
                <input
                  type="number"
                  placeholder="Variant Price"
                  step="0.01"
                  {...register(`variants.${index}.variantPrice`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="" className="mb-2">
                Variant Quantity
                <input
                  type="number"
                  placeholder="Variant Quantity"
                  {...register(`variants.${index}.variantQuantity`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600"
                />
              </label>
              <label htmlFor="" className="mb-2">
                Variant Cost
                <input
                  type="number"
                  step="0.01"
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
            aria-describedby="quantity-error"
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            defaultValue={0}
            className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div id="quantity-error" aria-live="polite" aria-atomic="true">
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
            defaultValue={0}
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
            defaultValue={0}
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
      <div className="mt-6 flex justify-end items-center gap-4">
        <Link
          href="/dashboard/product"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <CreatProductButton></CreatProductButton>
      </div>
    </form>
  );
}

function CreatProductButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-400"
      aria-disabled={pending}
    >
      {pending ? <Spinner /> : " "} Create Product
    </Button>
  );
}
