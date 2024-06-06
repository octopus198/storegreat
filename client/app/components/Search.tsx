"use client";
import { HiMagnifyingGlass } from "react-icons/hi2";

import React, { useState } from "react";
import { TextField } from "@radix-ui/themes";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  }

  return (
    <div>
      <TextField.Root
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      >
        <TextField.Slot>
          <HiMagnifyingGlass height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

export default Search;
