"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type GraphData = {
  name: string;
  sequential: number;
  parallel: number;
};

export default function ExecutionGraphModal({ isOpen, onClose }: Props) {
  const [data, setData] = useState<GraphData[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      const seq = await fetch("/api/queens/get-seq-exec").then((res) => res.json());
      const par = await fetch("/api/queens/get-par-exec").then((res) => res.json());

      setData([
        {
          name: "Execution Time",
          sequential: seq.message,
          parallel: par.message,
        },
      ]);
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[700px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Sequential vs Parallel Execution
          </h2>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="sequential"
              fill="#8884d8"
              name="Sequential"
            />

            <Bar
              dataKey="parallel"
              fill="#82ca9d"
              name="Parallel"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}