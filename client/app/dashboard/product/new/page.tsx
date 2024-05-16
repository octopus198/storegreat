"use client";
import React from "react";
import { Button, TextField, TextArea } from "@radix-ui/themes";
import { useState } from "react";

const NewProductPage = () => {
  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [costOfGoodsSold, setCostOfGoodsSold] = useState("");
  const [variants, setVariants] = useState("");
  const [warehouseEnterDate, setWarehouseEnterDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  // const [media, setMedia] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productData = {
      title,
      brandName,
      description,
      quantity,
      retailPrice,
      costOfGoodsSold,
      variants,
      warehouseEnterDate,
      expiryDate,
    };

    try {
      const response = await fetch(
        "http://localhost:4000/dashboard/product/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      const responseData = await response.json();
      console.log("Product created successfully", responseData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating product:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="space-y-3 w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="w-6/12 space-y-5">
        <h1 className="text-zinc-700 font-semibold text-2xl">Add product</h1>
        <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product name"
            ></input>
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Brand name
            </label>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand name"
            ></input>
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              placeholder="Product Description"
            />
          </div>
        </div>
        <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Media
            </label>
            <input className="block" type="file" id="myfile" name="myfile" />
          </div>
        </div>
        <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Quantity in warehouse
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Retail price
            </label>
            <input
              type="number"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Cost of goods sold
            </label>
            <input
              type="number"
              value={costOfGoodsSold}
              onChange={(e) => setCostOfGoodsSold(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Variants
            </label>
            <input
              type="text"
              value={variants}
              onChange={(e) => setVariants(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Warehouse enter date
            </label>
            <input
              type="date"
              value={warehouseEnterDate}
              onChange={(e) => setWarehouseEnterDate(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-700 font-semibold text-normal">
              Expiry date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <Button type="submit">Create New Product</Button>
      </form>
    </div>
  );
};

export default NewProductPage;
