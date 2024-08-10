import { BanknotesIcon, InboxIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/dashboard.data";
import { formatWithCommas } from "@/app/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

const iconMap = {
  sales: ArrowDownIcon,
  costs: ArrowUpIcon,
  profit: BanknotesIcon,
  product: InboxIcon,
};

export default async function CardWrapper() {
  const { totalSales, totalCost, totalProfit, productSold } =
    await fetchCardData();

  return (
    <>
      <Card title="Sales" value={formatWithCommas(totalSales)} type="sales" />
      <Card title="Costs" value={formatWithCommas(totalCost)} type="costs" />
      <Card
        title="Profit"
        value={formatWithCommas(totalProfit)}
        type="profit"
      />
      <Card title="Total Products Sold" value={productSold} type="product" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "sales" | "costs" | "profit" | "product";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-100 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
