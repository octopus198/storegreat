import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { fetchFilteredOrders } from "@/app/lib/order.data";
import { DeleteOrder, UpdateOrder } from "./buttons";

interface Order {
  _id: string;
  amount: number;
  status: string;
  creation_date: string;
  deletedAt: string | null;
}

export default async function OrderTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const displayedOrders = await fetchFilteredOrders(query, currentPage);
  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedOrders.map((order: Order) => (
            <Table.Row key={order._id}>
              <Table.Cell className="hover:underline">
                <Link href={`order/${order._id}/edit`}>
                  {order.amount}
                </Link>
              </Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>{order.creation_date}</Table.Cell>
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
