import { ThemePanel } from "@radix-ui/themes";
import NavBar from "../NavBar";
import Sidebar from "../Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full md:w-64">
          <Sidebar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-zinc-100">
          {children}
        </div>
      </div>
    </>
  );
}
