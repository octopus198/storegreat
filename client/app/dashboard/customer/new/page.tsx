import Form from "@/app/ui/customer/create-customer";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-7/12 space-y-3">
        <h1 className="text-zinc-700 font-semibold text-2xl">
          <Link href={"/dashboard/customer"}>
            <ArrowLeftIcon className="inline mr-1 size-5" />
            Add customer
          </Link>
        </h1>
        <Form/>
      </div>
    </div>
  );
}
