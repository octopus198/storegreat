"use client"; // since we need to track what's the current path and need to interact with browser API -> need to make this client
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { PiNoteBlank } from "react-icons/pi";

import classNames from "classnames"; // help with controlling the appearance of different states of an element (normal, hover
import { iconButtonPropDefs } from "@radix-ui/themes/props";

const Sidebar = () => {
  const currentPath = usePathname();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <RxDashboard size={25} />,
    },
    { label: "Product", href: "/dashboard/product", icon: <BsBox size={25} /> },
    {
      label: "Order",
      href: "/dashboard/order",
      icon: <PiNoteBlank size={30} />,
    },
  ];
  return (
    <aside className="bg-zinc-200 h-full px-1 py-1">
      <ul className=" flex flex-col space-y-2">
        {links.map((link) => (
          <Link href={link.href}>
            <li
              key={link.href}
              className={`${classNames({
                "text-indigo-800 font-bold": link.href === currentPath,
                "text-zinc-500 font-normal": link.href !== currentPath,
                "hover:bg-indigo-200 rounded-md px-5 py-5 transition-colors":
                  true,
              })} flex items-center gap-2`}
            >
              <div>{link.icon}</div>
              {link.label}
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
