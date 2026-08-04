"use client";

interface StatsCardProps {
  title: string;
  value: number;
}

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-[#0880EF] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <p className="text-sm font-medium text-black">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-[#0880EF]">
        {value}
      </h2>
    </div>
  );
}