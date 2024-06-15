// 'use client'
import React from 'react'
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { ProductsTableSkeleton } from "@/app/ui/skeletons";
import { fetchCustomerItems } from '@/app/lib/customer.data';
import { CreateCustomer } from '@/app/ui/customer/buttons';
import CustomerTable from '@/app/ui/customer/table';

interface Customer {
  _id: string;
  name: string;
  image: string;
  deletedAt: string | null;
  creation_date: Date;
}

export default async function Customer({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;
  const totalItems = await fetchCustomerItems(query);

  return (
    <div className="space-y-5 flex flex-col">
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search product..." />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <CustomerTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="flex justify-center">
        <Pagination
          pageSize={pageSize}
          currentPage={currentPage}
          itemCount={totalItems}
        />
      </div>
    </div>
  );
}
