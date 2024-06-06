import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { fetchFilteredCustomers } from "@/app/lib/customer.data";
import { DeleteCustomer, UpdateCustomer } from "./buttons";

interface Customer {
  _id: string;
  name: string;
  image: string;
  creation_date: string;
  deletedAt: string | null;
}

export default async function CustomerTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const displayedCustomers = await fetchFilteredCustomers(query, currentPage);
  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedCustomers.map((customer: Customer) => (
            <Table.Row key={customer._id}>
              <Table.Cell className="hover:underline">
                <Link href={`customer/${customer._id}/edit`}>
                  {customer.name}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <img
                  className="w-10 h-10 object-cover rounded border-solid border-2 border-zinc-200"
                  src={customer.image}
                  alt={customer.name}
                  width="50"
                  height="50"
                />
              </Table.Cell>
              <Table.Cell>{customer.creation_date}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-3">
                  <UpdateCustomer id={customer._id} />
                  <DeleteCustomer id={customer._id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
