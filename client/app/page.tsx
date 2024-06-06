"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full">
      <nav className="h-16 flex justify-between items-center border-b px-24 pt-2 pb-2">
        <Link href="/" className="font-extrabold text-xl">
          STOREGREAT.
        </Link>

        <Box>
          <Flex gap="4" align="center">
            <Link href="/" className=" font-semibold text-md">
              Home
            </Link>
            <Link href="/" className=" font-semibold text-md">
              Pricing
            </Link>
            <Link href="/" className=" font-semibold text-md">
              Contact
            </Link>
            <Button
              color="indigo"
              className="bg-indigo-600 hover:cursor-pointer rounded-md px-6 py-2 border-none font-semibold text-md"
              onClick={handleGoToDashboard}
            >
              Sign in
            </Button>
          </Flex>
        </Box>
      </nav>
      {/* <Box className="w-full"> */}
      <Flex className="justify-between w-full">
        <Box>
          <Button
            className="hover:cursor-pointer"
            onClick={handleGoToDashboard}
          >
            Go to dashboard
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
