'use client' // since we need to track what's the current path and need to interact with browser API -> need to make this client
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames"; // help with controlling the appearance of different states of an element (normal, hover

const Sidebar = () => {
  const currentPath = usePathname();
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Product", href: "/product" },
    { label: "Order", href: "/order" },
  ];
  return (
    <aside className="w-72 bg-zinc-100">
      <ul className=" flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
              <Link
                href={link.href}
                className={classNames({
                  'text-zinc-900': link.href === currentPath,
                  'text-zinc-500': link.href !== currentPath,
                  'hover:text-zinc-800 transition-colors': true
                })}
              >
                {link.label}
              </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
