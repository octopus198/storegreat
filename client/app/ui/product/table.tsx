import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { fetchFilteredProducts } from "@/app/lib/data";
import { DeleteProduct, UpdateProduct } from "./buttons";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import CONSTANTS from "@/app/lib/constants"
import { formatWithCommas } from "@/app/lib/utils";
// const defaultImageURL =
//   "https://res.cloudinary.com/dqw2psxim/image/upload/v1716641949/no_image_uyotz1.png";

interface Product {
  _id: string;
  imageURL: [string];
  productName: string;
  retailPrice: number;
  COGS: number;
  stockQuantity: number;
  deletedAt: string | null;
  hasVariants: boolean;
  variants?: {
    variantName: string;
    variantPrice: number;
    variantCOGS: number;
    variantQuantity: number;
  }[];
}

type Variant = {
  variantName: string;
  variantPrice: number;
  variantCOGS: number;
  variantQuantity: number;
}[];

export default async function ProductTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const displayedProducts = await fetchFilteredProducts(query, currentPage);

  function getTotalStock(product: Product): number {
    let totalStock = 0;
    if (product.hasVariants) {
      product.variants?.forEach((variant) => {
        totalStock += variant.variantQuantity;
      });
    }
    return totalStock;
  }

  function getTotalStockValue(product: Product): number {
    let totalStockValue = 0;
    if (product.hasVariants) {
      product.variants?.forEach((variant) => {
        totalStockValue += variant.variantQuantity * variant.variantCOGS;
      });
    }
    return totalStockValue;
  }

  function getTotalVariants(product: Product): number {
    let totalVariants = 0;
    if (product.hasVariants) {
      product.variants?.forEach((variant) => {
        totalVariants += 1;
      });
    }
    return totalVariants;
  }

  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {displayedProducts.map((product: Product) => (
            <Table.Row key={product._id}>
              <Table.Cell>
                <img
                  className="w-10 h-10 object-cover rounded border-solid border-2 border-zinc-200"
                  src={
                    product.imageURL.length > 0
                      ? product.imageURL[0]
                      : CONSTANTS.EMPTY_IMG
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
              <Table.Cell
                style={{
                  color:
                    (product.hasVariants && getTotalStock(product) <= CONSTANTS.LOWSTOCK_THRESHOLD) ||
                    (!product.hasVariants && product.stockQuantity <= CONSTANTS.LOWSTOCK_THRESHOLD)
                      ? "red"
                      : "inherit",
                }}
              >
                {product.hasVariants ? (
                  <div className="flex items-center">
                    <span style={{ marginRight: 5 }}>{getTotalStock(product)}</span>
                    {(product.hasVariants && getTotalStock(product) <= CONSTANTS.LOWSTOCK_THRESHOLD) ||
                    (!product.hasVariants && product.stockQuantity <= CONSTANTS.LOWSTOCK_THRESHOLD) ? (
                      <ArrowTrendingDownIcon className="w-5 text-red-500 mr-1" />
                    ) : null}
                    in {getTotalVariants(product)} variants
                  </div>
                ) : (
                  product.stockQuantity
                )}
              </Table.Cell>
              <Table.Cell>{product.hasVariants ? formatWithCommas(getTotalStockValue(product)) : formatWithCommas(product.COGS * product.stockQuantity)}</Table.Cell>
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
