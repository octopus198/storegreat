"use client";

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/buttons";
import { updateOrder } from "@/app/lib/order.actions";
import { useFormState } from "react-dom";
import { CustomerField, ProductField } from "@/app/lib/definitions";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  amount: number;
  status: string;
  deletedAt: String;
  creation_date: Date;
  userID: CustomerField;
}

type FormValues = {
  products: {
    variantId: string;
    productId: string;
    quantity: number;
  }[];
};

function getTotalQuantity(payload: FormValues["products"]) {
  let total = 0;
  for (const item of payload) {
    total = total + (Number.isNaN(item.quantity) ? 0 : item.quantity);
  }
  return total;
}

function TotalQuantity({ control }: { control: Control<FormValues> }) {
  const products = useWatch({
    control,
    name: "products",
  });

  return (
    <p className="text-zinc-700 font-semibold">
      Total Quantity: {getTotalQuantity(products)}
    </p>
  );
}

export default function Form({
  customers,
  products,
  orderDetail,
}: {
  customers: CustomerField[];
  products: ProductField[];
  orderDetail: Order;
}) {
  const initialState = { message: null, errors: {} };
  const updateOrderWithId = updateOrder.bind(null, orderDetail._id);
  const [state, dispatch] = useFormState(updateOrderWithId, initialState);

  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [{ variantId: "", productId: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "products",
    control,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const watchedProducts = useWatch({
    control,
    name: "products",
  });

  useEffect(() => {
    let totalAmount = 0;
    let totalCost = 0;
    for (const item of watchedProducts) {
      const [productId, variantId] = item.variantId.split("|");
      const selectedProduct = products.find(
        (product) => product._id === productId
      );
      if (selectedProduct) {
        if (variantId) {
          const selectedVariant = selectedProduct.variants.find(
            (variant) => variant._id === variantId
          );
          if (selectedVariant) {
            totalAmount =
              totalAmount +
              (Number.isNaN(selectedVariant.variantPrice * item.quantity)
                ? 0
                : selectedVariant.variantPrice * item.quantity);
            totalCost =
              totalCost +
              (Number.isNaN(selectedVariant.variantCOGS * item.quantity)
                ? 0
                : selectedVariant.variantCOGS * item.quantity);
          }
        } else {
          totalAmount += selectedProduct.retailPrice * item.quantity;
          totalCost += selectedProduct.COGS * item.quantity;
        }
      }
    }
    setTotalAmount(totalAmount);
    setTotalCost(totalCost);
  }, [watchedProducts, products]);
  return (
    <form action={dispatch} className="space-y-5">
      {/* Customer Name */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              // defaultValue={orderDetail.userID._id}
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {/* {state.errors?.customerId &&
            state.errors.customerId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
        </div>
      </div>

      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="variant"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Choose Product
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-4">
              <label htmlFor="">
                Product
                <div className="relative">
                  <select
                    id="product"
                    {...register(`products.${index}.variantId`, {
                      required: "Product is required",
                    })}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    aria-describedby="product-error"
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {products.map((product) =>
                      product.variants.length > 0 ? (
                        <optgroup key={product._id} label={product.productName}>
                          {product.variants.map((variant) => (
                            <option
                              key={variant._id}
                              value={`${product._id}|${variant._id}`}
                            >
                              {/* the pipe | symbol is a delimeter to seperate two strings */}
                              {variant.variantName} (Stock:{" "}
                              {variant.variantQuantity})
                            </option>
                          ))}
                        </optgroup>
                      ) : (
                        <option key={product._id} value={product._id}>
                          {product.productName} (Stock: {product.stockQuantity})
                        </option>
                      )
                    )}
                  </select>
                 
                </div>
              </label>
              <label htmlFor="">
                Product Quantity
                <input
                  type="number"
                  placeholder="Quantity"
                  {...register(`products.${index}.quantity`, {
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
              append({ variantId: "", productId: "", quantity: 0 })
            }
          >
            Add Variant
          </Button>
        </div>
        <p className="text-zinc-700 font-semibold">
          Total Amount: {totalAmount}
        </p>
        <TotalQuantity control={control} />
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {/* {state.errors?.products &&
            state.errors.products.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
        </div>
      </div>
      <input type="hidden" value={totalAmount} id="amount" name="amount" />
      <input type="hidden" value={totalCost} id="cost" name="cost" />

      {/* Invoice Status */}
      <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="block text-zinc-700 font-semibold text-normal"
          >
            Set order status
          </label>
          <fieldset>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    value="pending"
                    className="text-white-600 h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-2"
                  />
                  <label
                    htmlFor="pending"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Pending <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paid"
                    name="status"
                    type="radio"
                    value="paid"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Paid <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {/* {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))} */}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/order"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
}
