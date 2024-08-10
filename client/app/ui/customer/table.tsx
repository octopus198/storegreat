import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { fetchFilteredCustomers } from "@/app/lib/customer.data";
import { DeleteCustomer, UpdateCustomer } from "./buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import CONSTANTS from "@/app/lib/constants"
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
            <Table.ColumnHeaderCell>Avatar</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ textAlign: 'right' }}>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedCustomers.map((customer: Customer) => (
            <Table.Row key={customer._id}>
              <Table.Cell>
                <img
                  className="w-10 h-10 object-contain rounded-full border-solid border-2 border-zinc-200"
                  src={customer.image? customer.image : CONSTANTS.EMPTY_IMG}
                  alt={customer.name}
                  width="28"
                  height="28"
                />
              </Table.Cell>
              <Table.Cell className="hover:underline">
                <Link href={`customer/${customer._id}/edit`}>
                  {customer.name}
                </Link>
              </Table.Cell>
              <Table.Cell>{formatDateToLocal(customer.creation_date)}</Table.Cell>
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
