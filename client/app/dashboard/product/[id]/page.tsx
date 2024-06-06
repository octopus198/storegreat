// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { Button, TextArea, TextField } from "@radix-ui/themes";
// import Link from "next/link";
// import { ArrowLeftIcon } from "@radix-ui/react-icons";
// import { Grid, Box } from "@radix-ui/themes";
// import { useRouter } from "next/navigation";
// import { getNewToken } from "@/app/utils/auth/token";
// import { useAppContext } from "@/app/AppProvider";

// interface ProductDetail {
//   productName: string;
//   productDescription: string;
//   brand: string;
//   imageURL: string[];
//   stockQuantity: number;
//   retailPrice: number;
//   COGS: number;
//   variants: string[];
//   warehouse_enter_date?: Date;
//   exp_date?: Date;
// }

// interface Props {
//   params: { id: string };
// }

// const ProductDetailPage = ({ params }: Props) => {
//   const [productDetail, setProductDetail] = useState<ProductDetail>({
//     productName: "",
//     brand: "",
//     productDescription: "",
//     stockQuantity: 0,
//     retailPrice: 0,
//     COGS: 0,
//     variants: [],
//     warehouse_enter_date: undefined,
//     exp_date: undefined,
//     imageURL: [],
//   });

//   const router = useRouter();
//   const [image, setImage] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { accessToken, refreshToken} = useAppContext();
//   const [retryToggle, setRetryToggle] = useState(false);

//   // HANDLE IMAGE UPLOAD SEPERATELY (UPDATE IMAGES OF PRODUCT)
//   const handleImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0] || null;
//     if (file) {
//       setImage(file);

//       const formData = new FormData();
//       formData.append("files", file);

//       try {
//         const response = await fetch(
//           "http://localhost:4000/dashboard/product/new/upload",
//           {
//             method: "POST",
//             headers: {
//               // "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//             body: formData,
//           }
//         );
//         console.log(response)

//         if (!response.ok) {
//           throw new Error("Failed to upload images")
//         }

//         const data = await response.json();
//         console.log(data.files);

//         setProductDetail((prevProductDetail) => ({
//           ...prevProductDetail,
//           imageURL: [...prevProductDetail.imageURL, data.files[0].secure_url],
//         }));
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error("Error uploading images:", error.message);
//         } else {
//           console.error("Unknown error - adding images:", error);
//         }
//       }
//     }
//   };

//   // HANDLE BUTTON TO UPLOAD IMAGE
//   const handleUploadButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   // HANDLE DELETE PRODUCT (SOFT DELETE)
//   // const handleDeleteProduct = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `http://localhost:4000/dashboard/product/${params.id}`,
//   //       {
//   //         method: "PATCH",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${accessToken}`,
//   //         },
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Faile to delete product")
//   //     }

//   //     console.log(response);
//   //     router.push('/dashboard/product');
//   //   } catch (error) {
//   //     console.error("Error deleting product:", error);
//   //   }
//   // };

//   // HANDLE UPDATE PRODUCT INFORMATION
//   // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   //   event.preventDefault();
//   //   try {
//   //     console.log(accessToken);
//   //     const response = await fetch(
//   //       `http://localhost:4000/dashboard/product/${params.id}`,
//   //       {
//   //         method: "PUT",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${accessToken}`,
//   //         },
//   //         body: JSON.stringify(productDetail),
//   //       }
//   //     );
//   //     console.log(response);

//   //     if (!response.ok) {
//   //       throw new Error("Failed to update product details")
//   //     }
//   //     console.log("Product updated successfully");
//   //   } catch (error) {
//   //     console.error("Error updating product:", error);
//   //   }
//   // };

//   // HANDLE FIELDS VALUE CHANGE
//   const handleChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = event.target;

//     // !!!! how to handle ware house details?
//     if (name === "warehouse_enter_date" || name === "exp_date") {
//       setProductDetail((prevProductDetail) => ({
//         ...prevProductDetail,
//         [name]: value ? new Date(value).toISOString() : undefined,
//       }));
//     } else {
//       setProductDetail((prevProductDetail) => ({
//         ...prevProductDetail,
//         [name]: value,
//       }));
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="w-full flex flex-col justify-center items-center">
//       <div className="w-7/12 space-y-3">
//         <h1 className="text-zinc-700 font-semibold text-2xl">
//           <Link href={"/dashboard/product"}>
//             <ArrowLeftIcon className="inline mr-1 size-5" />
//             {productDetail?.productName}
//           </Link>
//         </h1>
//         {/* onSubmit={handleSubmit}  */}
//         <form className="space-y-5">
//           <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Title
//               </label>
//               <TextField.Root
//                 type="text"
//                 name="productName"
//                 value={productDetail.productName}
//                 onChange={handleChange}
//               ></TextField.Root>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Brand name
//               </label>
//               <TextField.Root
//                 type="text"
//                 value={productDetail.brand}
//                 onChange={handleChange}
//                 name="brand"
//               ></TextField.Root>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Description
//               </label>
//               <TextArea
//                 rows={10}
//                 value={productDetail.productDescription}
//                 onChange={handleChange}
//                 name="productDescription"
//               />
//             </div>
//           </div>

//           {/* IMAGE UPLOAD SECTION */}

//           {productDetail.imageURL.length > 0 && (
//             <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="imageInput"
//                   className="block text-zinc-700 font-semibold text-normal"
//                 >
//                   Product Image
//                 </label>
//                 <Grid columns="4" gap="3" rows="repeat(2, 100px)" width="auto">
//                   <Box
//                     gridColumn="1 / 3"
//                     gridRow="1 / 3"
//                     className="rounded-md bg-zinc-100 "
//                     style={{ overflow: "hidden" }}
//                   >
//                     <img
//                       src={productDetail.imageURL[0]}
//                       alt="Product Image"
//                       className="w-full h-full rounded-md object-contain"
//                     />
//                   </Box>
//                   {productDetail.imageURL.slice(1).map((url, index) => (
//                     <Box
//                       key={index + 1}
//                       className="rounded-md bg-zinc-100"
//                       style={{ overflow: "hidden" }}
//                     >
//                       <img
//                         src={url}
//                         alt={`Product Image ${index + 2}`}
//                         className="w-full h-full object-contain rounded-md"
//                       />
//                     </Box>
//                   ))}
//                   {productDetail.imageURL.length < 5 && (
//                     <Box
//                       className="rounded-md bg-zinc-100"
//                       style={{ overflow: "hidden" }}
//                     >
//                       <div className="flex items-center justify-center w-full h-full rounded-md hover:bg-zinc-100 border-dotted border-2 border-zinc-200">
//                         <Button type="button" onClick={handleUploadButtonClick}>
//                           Upload image
//                         </Button>
//                         <input
//                           type="file"
//                           id="imageInput"
//                           name="file"
//                           ref={fileInputRef}
//                           onChange={handleImageUpload}
//                           accept="image/*"
//                           className="hidden"
//                         />
//                       </div>
//                     </Box>
//                   )}
//                 </Grid>
//               </div>
//             </div>
//           )}

//           {productDetail.imageURL.length === 0 && (
//             <div className=" bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="imageInput"
//                   className="block text-zinc-700 font-semibold text-normal"
//                 >
//                   Product Image
//                 </label>
//                 <div className="flex items-center justify-center w-full h-32 rounded-md hover:bg-zinc-100 border-dotted border-2 border-zinc-200">
//                   <Button type="button" onClick={handleUploadButtonClick}>
//                     Upload image
//                   </Button>
//                   <input
//                     type="file"
//                     id="imageInput"
//                     name="file"
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                     accept="image/*"
//                     className="hidden"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Quantity in warehouse
//               </label>
//               <input
//                 type="number"
//                 value={productDetail.stockQuantity}
//                 onChange={handleChange}
//                 className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Retail price
//               </label>
//               <input
//                 type="number"
//                 value={productDetail.retailPrice}
//                 onChange={handleChange}
//                 className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Cost of goods sold
//               </label>
//               <input
//                 type="number"
//                 value={productDetail.COGS}
//                 onChange={handleChange}
//                 className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//           </div>
//           <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//             <div className="space-y-2">
//               <label className="block text-zinc-700 font-semibold text-normal">
//                 Variants
//               </label>
//               <input
//                 type="text"
//                 value={productDetail.variants}
//                 onChange={handleChange}
//                 className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//           </div>
//           {/*
//             <div className="bg-white px-10 py-10 rounded-lg shadow-md space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-zinc-700 font-semibold text-normal">
//                   Warehouse enter date
//                 </label>
//                 <input
//                   type="date"
//                   value={productDetail.warehouse_enter_date}
//                   onChange={handleChange}
//                   className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-zinc-700 font-semibold text-normal">
//                   Expiry date
//                 </label>
//                 <input
//                   type="date"
//                   value={productDetail.warehouse_enter_date}
//                   onChange={handleChange}
//                   className="block border-solid border-indigo-600 w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div> */}
//           <Button type="submit">Update Product</Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
