import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { fetchFilteredProducts } from "@/app/lib/data";
import { DeleteProduct, UpdateProduct } from "./buttons";
const defaultImageURL =
  "https://res.cloudinary.com/dqw2psxim/image/upload/v1716641949/no_image_uyotz1.png";

interface Product {
  _id: string;
  imageURL: [string];
  productName: string;
  retailPrice: number;
  COGS: number;
  stockQuantity: number;
  deletedAt: string | null;
}

export default async function ProductTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const displayedProducts = await fetchFilteredProducts(query, currentPage);
  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Retail Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost of Goods Sold</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body >
          {displayedProducts.map((product: Product) => (
            <Table.Row key={product._id} >
              <Table.Cell>
                <img
                  className="w-10 h-10 object-cover rounded border-solid border-2 border-zinc-200"
                  src={
                    product.imageURL.length > 0
                      ? product.imageURL[0]
                      : defaultImageURL
                  }
                  alt={product.productName}
                  width="50"
                  height="50"
                />
              </Table.Cell>
              <Table.Cell className="hover:underline">
                <Link href={`product/${product._id}/edit`}>
                  {product.productName}
                </Link>
              </Table.Cell>
              <Table.Cell>{product.retailPrice}</Table.Cell>
              <Table.Cell>{product.COGS}</Table.Cell>
              <Table.Cell style={{ color: product.stockQuantity < 10 ? 'red' : 'inherit' }}>{product.stockQuantity}</Table.Cell>
              <Table.Cell>{product.COGS * product.stockQuantity}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-3">
                  <UpdateProduct id={product._id} />
                  <DeleteProduct id={product._id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
