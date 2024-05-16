import React from "react";
import Link from "next/link";
import { TextField } from "@radix-ui/themes";
import { Flex, Avatar } from "@radix-ui/themes";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Box } from "@radix-ui/themes";
import { IoStorefrontOutline } from "react-icons/io5";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center border-b px-10 h-16 sticky top-0 bg-indigo-600">
      <Link href="/" className="text-zinc-50 font-extrabold text-lg">STOREGREAT.</Link>
      <TextField.Root placeholder="Search">
        <TextField.Slot>
          <HiMagnifyingGlass height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Box>
        <Flex gap="2">
          <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback="A"
            size="4"
            variant="soft"
            color="indigo"
            radius="large"
          />
        </Flex>
      </Box>
    </nav>
  );
};

export default NavBar;
