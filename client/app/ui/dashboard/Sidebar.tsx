import Link from "next/link";
import React from "react";
import { BuildingStorefrontIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import NavLinks from "./Navlinks";
import Logo from "../logo";
import { signout } from "@/app/lib/auth.actions";
import { redirect } from "next/navigation";
import { lusitana } from "../fonts";
const Sidebar = () => {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-indigo-600 p-4 md:h-40"
        href="/"
      >
        <div
          className={`${lusitana.className} gap-4 flex flex-row items-center leading-none text-white`}
        >
          <p className="text-[44px] ">Storegreat</p>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:block"></div>
        <Link href="/dashboard/user" className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <UserCircleIcon className="w-6" />
          <div className="hidden md:block">My Account</div>
        </Link>
        <form
          action={async () => {
            "use server";
            await signout();
            redirect("/");
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;

// <aside className="bg-zinc-200 h-screen px-1 py-1 flex flex-col">
//   <ul className=" flex flex-col space-y-2">
//     {links.map((link) => (
//       <Link href={link.href}>
//         <li
//           key={link.href}
//           className={`${classNames({
//             "text-indigo-800 font-bold bg-indigo-200 rounded-md": link.href === currentPath,
//             "text-zinc-500 font-normal": link.href !== currentPath,
//             "hover:bg-indigo-200 rounded-md px-5 py-5 transition-colors":
//               true,
//           })} flex items-center gap-2`}
//         >
//           <div>{link.icon}</div>
//           {link.label}
//         </li>
//       </Link>
//     ))}
//   </ul>
//   <div
//     onClick={handleSignOut}
//     className="text-zinc-500 font-normal hover:text-indigo-800 hover:font-bold hover:bg-indigo-200 rounded-md px-5 py-5 transition-colors flex items-center gap-2"
//   >
//     <IoPowerOutline size={25} />
//     Log out
//   </div>
// </aside>
