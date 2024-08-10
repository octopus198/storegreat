import { BarChart, Card } from "@tremor/react";
import { lusitana } from "../fonts";
import { fetchRevenueData } from "@/app/lib/dashboard.data";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default async function RevenueChart() {
  const revenueData = await fetchRevenueData();

  return (
    <main className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-100 p-4">
        <div className="bg-white">
          <BarChart
            data={revenueData}
            index="monthYear"
            categories={["revenue"]}
            colors={["#3b82f6", "#6366f1", "#10b981"]}
            yAxisWidth={96}
          />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </main>
  );
}
