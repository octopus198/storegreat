"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Spinner, TextField } from "@radix-ui/themes";
import { Button } from "../buttons";
import Link from "next/link";
import { updateCustomer } from "@/app/lib/customer.actions";

interface Customer {
  _id: string;
  name: string;
  image: string;
}

type FormValues = {
  name: string;
};

export default function Form({ customerDetail }: { customerDetail: Customer }) {
  const initialState = { message: null, errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customerDetail._id);
  const [state, dispatch] = useFormState(updateCustomerWithId, initialState);

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
            defaultValue={customerDetail.name}
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

        {/* IMAGE */}
        <div className="space-y-2">
          {customerDetail.image ? (
            <label
              htmlFor="image"
              className="block text-zinc-700 font-semibold text-normal"
            >
              Image
            </label>
          ) : (
            ""
          )}
          {customerDetail.image && (
            <img
              src={customerDetail.image}
              alt={customerDetail.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Link
          href="/dashboard/customer"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <UpdateCustomerButton />
      </div>
    </form>
  );
}

function UpdateCustomerButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-400"
      aria-disabled={pending}
    >
      {pending ? <Spinner /> : " "} Update Customer
    </Button>
  );
}
