import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { fetchCustomerById } from "@/app/lib/customer.data";
import Form from "@/app/ui/customer/edit-customer";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const customerDetail = await fetchCustomerById(id);

    return (
        <div className="w-full flex flex-col justify-center items-center">
        <div className="w-7/12 space-y-3">
            <h1 className="text-zinc-700 font-semibold text-2xl">
            <Link href={"/dashboard/customer"}>
                <ArrowLeftIcon className="inline mr-1 size-5" />
                Customer details
            </Link>
            </h1>
            <Form customerDetail={customerDetail} />
        </div>
        </div>
    );
}