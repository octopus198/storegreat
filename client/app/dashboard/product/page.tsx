// 'use client'
import Pagination from "@/app/ui/pagination";
import ProductTable from "@/app/ui/product/table";
import { fetchProductItems } from "@/app/lib/data";
import { CreateProduct } from "@/app/ui/product/buttons";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { ProductsTableSkeleton } from "@/app/ui/skeletons";

interface Product {
  _id: string;
  imageURL: [string];
  productName: string;
  retailPrice: number;
  COGS: number;
  deletedAt: string | null;
  creation_date: Date;
}

export default async function Product({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;
  const totalItems = await fetchProductItems(query);

  return (
    <div className="space-y-5 flex flex-col">
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search product..." />
        <CreateProduct />
      </div>
      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <ProductTable query={query} currentPage={currentPage} />
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
