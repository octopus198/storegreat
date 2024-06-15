import { fetchUser } from "@/app/lib/dashboard.data";
import { formatDateToLocal } from "@/app/lib/utils";
import { lusitana } from "@/app/ui/fonts";

export default async function User() {
  const user = await fetchUser();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        My Account
      </h1>
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-100 px-4 py-4 rounded-lg">
          Username: <strong>{user.username}</strong>
        </div>
        <div className="bg-gray-100 px-4 py-4 rounded-lg">
          Email: <strong>{user.email}</strong>
        </div>
        <div className="bg-gray-100 px-4 py-4 rounded-lg">
          Registered date: <strong>{formatDateToLocal(user.registration_date)}</strong>
        </div>
      </div>
    </main>
  );
}
