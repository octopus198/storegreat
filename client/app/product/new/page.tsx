"use client";
import React from "react";
import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NewProductPage = () => {
  return (
    <div className="space-y-3">
      <TextField.Root placeholder="Product name"></TextField.Root>
      <SimpleMDE placeholder="Product description" />
      <Button>Create New Product</Button>
    </div>
  );
};

export default NewProductPage;
