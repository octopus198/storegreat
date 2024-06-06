"use client";

import {
  ChartBarIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  {
    name: "Products",
    href: "/dashboard/product",
    icon: CubeIcon,
  },
  { name: "Orders", href: "/dashboard/order", icon: DocumentDuplicateIcon },
  { name: "Customers", href: "/dashboard/customer", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-indigo-100 text-indigo-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
