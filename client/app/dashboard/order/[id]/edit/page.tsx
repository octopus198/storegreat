import Form from "@/app/ui/order/edit-oder";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { fetchOrderById } from "@/app/lib/order.data";
import { fetchCustomers } from "@/app/lib/customer.data";
import { fetchProducts } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const orderDetail = await fetchOrderById(id);
  const customers = await fetchCustomers();
  const products = await fetchProducts();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-7/12 space-y-3">
        <h1 className="text-zinc-700 font-semibold text-2xl">
          <Link href={"/dashboard/order"}>
            <ArrowLeftIcon className="inline mr-1 size-5" />
            Order details
          </Link>
        </h1>
        <Form
          customers={customers}
          products={products}
          orderDetail={orderDetail}
        />
      </div>
    </div>
  );
}
