// "use client";
import React, { useEffect, useRef } from "react";
import { Box, Button, Grid, TextArea, TextField } from "@radix-ui/themes";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { getNewToken } from "@/app/utils/auth/token";
import { useAppContext } from "@/app/AppProvider";
import Form from "@/app/ui/product/create-product";

const NewProductPage = () => {

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-7/12 space-y-3">
        <h1 className="text-zinc-700 font-semibold text-2xl">
          <Link href={"/dashboard/product"}>
            <ArrowLeftIcon className="inline mr-1 size-5" />
            Add product
          </Link>
        </h1>
        <Form/>
      </div>
    </div>
  );
};

export default NewProductPage;


// HANDLE FORM SUBMISSION
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const productData = {
  //     productName,
  //     brand,
  //     productDescription,
  //     stockQuantity,
  //     retailPrice,
  //     COGS,
  //     variants,
  //     warehouse_enter_date,
  //     exp_date,
  //     imageURL,
  //   };

  //   try {
  //     const response = await fetch(
  //       "http://localhost:4000/dashboard/product/new",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify(productData),
  //       }
  //     );
  //     console.log(response);

  //     if (!response.ok) {
  //       throw new Error("Faile to upload new products")
  //     }

  //     // if (!response.ok) {
  //     //     if (response.status === 403) {
         
  //     //         updateTokens(refreshToken);
  //     //         handleImageUpload(event); 
            
  //     //     } else {
  //     //       throw new Error("Failed to get product details");
  //     //     }
  //     //   }

  //     const responseData = await response.json();
  //     console.log(responseData);
  //     if (!responseData || !responseData.product || !responseData.product._id) {
  //       throw new Error(
  //         "No response data or no responseData.product or no responseData.product._id"
  //       );
  //     }
  //     console.log("Product created successfully", responseData);
  //     router.push(`/dashboard/product/${responseData.product._id}`);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error creating product:", error.message);
  //     } else {
  //       console.error("Unknown error:", error);
  //     }
  //   }
  // };

{/* <form onSubmit={handleSubmit} className="space-y-5">
          <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
            <div className="space-y-2">
              <label className="block text-zinc-700 font-semibold text-normal">
                Title
              </label>
              <TextField.Root
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product name"
              ></TextField.Root>
            </div>
            <div className="space-y-2">
              <label className="block text-zinc-700 font-semibold text-normal">
                Brand name
              </label>
              <TextField.Root
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
              ></TextField.Root>
            </div>
            <div className="space-y-2">
              <label className="block text-zinc-700 font-semibold text-normal">
                Description
              </label>
              <TextArea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={10}
                placeholder="Product Description"
              />
            </div>
          </div>

     
          {imageURL.length > 0 && (
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
          )}

       
          <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
            <div className="space-y-2">
              <label className="block text-zinc-700 font-semibold text-normal">
                Quantity in warehouse
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
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
                value={COGS}
                onChange={(e) => setCOGS(e.target.value)}
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
                value={warehouse_enter_date}
                onChange={(e) => setWarehouse_enter_date(e.target.value)}
                className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-zinc-700 font-semibold text-normal">
                Expiry date
              </label>
              <input
                type="date"
                value={exp_date}
                onChange={(e) => setExp_date(e.target.value)}
                className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <Button type="submit">Create New Product</Button>
        </form> */}
