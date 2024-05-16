import React from "react";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
const Product = () => {
  return (
    <div >
      <Button>
        <Link href="/dashboard/product/new">New Product</Link>
      </Button>
    </div>
  );
};

export default Product;
