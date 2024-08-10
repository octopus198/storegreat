import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
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