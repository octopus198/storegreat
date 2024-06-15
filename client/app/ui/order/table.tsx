import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { fetchFilteredOrders } from "@/app/lib/order.data";
import { DeleteOrder, UpdateOrder } from "./buttons";
import { formatDateToLocal, formatWithCommas } from "@/app/lib/utils";
import InvoiceStatus from "./status";
import CONSTANTS from "@/app/lib/constants";

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

export default async function OrderTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const displayedOrders = await fetchFilteredOrders(query, currentPage);
  console.log(displayedOrders);
  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Customer Avatar</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Customer name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedOrders.map((order: Order) => (
            <Table.Row key={order._id}>
              <Table.Cell>
                <img
                  className="w-10 h-10 object-cover rounded-full border-solid border-2 border-zinc-200"
                  src={
                    order.customerId.image
                      ? order.customerId.image
                      : CONSTANTS.EMPTY_IMG
                  }
                  alt={order.customerId.image}
                  width="28"
                  height="28"
                />
              </Table.Cell>
              <Table.Cell>{order.customerId.name}</Table.Cell>
              <Table.Cell className="hover:underline">
                <Link href={`order/${order._id}/edit`}>
                  {formatWithCommas(order.amount)}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <InvoiceStatus status={order.status} />
              </Table.Cell>
              <Table.Cell>{formatDateToLocal(order.creation_date)}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-3">
                  <UpdateOrder id={order._id} />
                  <DeleteOrder id={order._id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
