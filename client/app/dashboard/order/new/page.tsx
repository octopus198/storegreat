import Form from "@/app/ui/order/create-order";
import { fetchCustomers } from "@/app/lib/customer.data";
import { fetchProducts } from "@/app/lib/data";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default async function Page() {
  const customers = await fetchCustomers();
  const products = await fetchProducts();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-7/12 space-y-3">
        <h1 className="text-zinc-700 font-semibold text-2xl">
          <Link href={"/dashboard/order"}>
            <ArrowLeftIcon className="inline mr-1 size-5" />
            Add order
          </Link>
        </h1>
        <Form customers={customers} products={products}/>
      </div>
    </div>
  );
}
