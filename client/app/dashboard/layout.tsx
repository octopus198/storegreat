import Sidebar from "../ui/dashboard/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-zinc-50">
      <div className="w-full flex-none md:w-64">
        <Sidebar />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
