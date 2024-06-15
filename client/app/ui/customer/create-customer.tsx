"use client";
import { Spinner, TextField } from "@radix-ui/themes";
import { Button } from "../buttons";
import Link from "next/link";
import { useState, ChangeEvent } from "react";
import { createCustomer } from "@/app/lib/customer.actions";
import { useFormState, useFormStatus } from "react-dom";
import { Spinnaker } from "next/font/google";

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createCustomer, initialState);

  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result.toString());
        } else {
          console.error("Error reading file");
        }
      };
      reader.onerror = () => {
        console.error("Error reading file");
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, reset the image state to null
      setImage(null);
    }
  };

  return (
    <form action={dispatch} className="space-y-5">
      <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Customer name
          </label>
          <TextField.Root
            aria-describedby="customer-error"
            id="name"
            name="name"
            placeholder="Customer name"
            defaultValue=""
          ></TextField.Root>
        </div>
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* IMAGE UPLOAD */}
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
            {image && (
              <img
                src={image}
                alt={`Uploaded`}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customer"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <CreateCustomerButton/>
      </div>
    </form>
  );
}

function CreateCustomerButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-400"
      aria-disabled={pending}
    >
      {pending? <Spinner />: " "} Create Customer
    </Button>
  );
}