import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestOrders } from "@/app/lib/dashboard.data";
import CONSTANTS from "@/app/lib/constants";
import { formatWithCommas } from "@/app/lib/utils";
export default async function LatestOrders() {
  const latestOrders = await fetchLatestOrders();
  interface Customer {
    name: string;
    image: string;
  }
  interface Order {
    _id: string;
    amount: number;
    status: string;
    creation_date: string;
    deletedAt: string | null;
    customerId: Customer;
  }
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          {latestOrders.map((order: Order, i: number) => {
            return (
              <div
                key={order._id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <img
                    src={
                      order.customerId.image
                        ? order.customerId.image
                        : CONSTANTS.EMPTY_IMG
                    }
                    alt={`${order.customerId.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {order.customerId.name}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {formatWithCommas(order.amount)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
