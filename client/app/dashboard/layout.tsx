import { ThemePanel } from "@radix-ui/themes";
import NavBar from "../components/NavBar";
import Sidebar from "../ui/dashboard/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="flex flex-col">
    //   <div className="z-1000">
    //     <NavBar />
    //   </div>
    //   <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
    //     <div className="w-full md:w-64">
    //       <Sidebar />
    //     </div>
    //     <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-zinc-100 z-500">
    //       {children}
    //     </div>
    //   </div>
    // </div>

    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-zinc-50">
      <div className="w-full flex-none md:w-64">
        <Sidebar />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
