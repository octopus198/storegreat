import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} gap-4 flex flex-row items-center leading-none text-white`}
    >
      <BuildingStorefrontIcon className="h-24 w-24" />
      <p className="text-[72px] ">Storegreat</p>
    </div>
  );
}