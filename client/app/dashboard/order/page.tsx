// 'use client'
import React from 'react'
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { ProductsTableSkeleton } from "@/app/ui/skeletons";
import { fetchOrderItems } from '@/app/lib/order.data';
import { CreateOrder } from '@/app/ui/order/buttons';
import OrderTable from '@/app/ui/order/table';

interface Order {
  _id: string;
  amount: number;
  status: string;
  deletedAt: string | null;
  creation_date: Date;
}

export default async function Order({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;
  const totalItems = await fetchOrderItems(query);

  return (
    <div className="space-y-5 flex flex-col">
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search order..." />
        <CreateOrder />
      </div>
      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <OrderTable query={query} currentPage={currentPage} />
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
