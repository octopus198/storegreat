import React from "react";
import Link from "next/link";
import { Flex, Avatar } from "@radix-ui/themes";
import { Box } from "@radix-ui/themes";
import Search from "./Search";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center border-b px-10 bg-indigo-600 pt-2 pb-2">
      <Link href="/" className="text-zinc-50 font-extrabold text-lg">STOREGREAT.</Link>
      <Box className="w-4/12">
        <Search placeholder="well"/>
      </Box>
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
