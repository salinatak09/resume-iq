"use client";

import { getScoreColor } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const bgClasses = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500'
}

const chartColors = {
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
} as const;


const ScoreCard = ({
  title,
  score,
}: {
  title: string;
  score: number;
}) => {

  const chartData = [
    {
      name: "Score",
      value: score,
    },
    {
      name: "Remaining",
      value: 100 - score,
    },
  ];

  const color = getScoreColor(score);

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-2 text-5xl font-bold text-slate-800`}>{score}</p>
          <div className="mt-4 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${bgClasses[color]}`}
              style={{ width: `${score}%`}}
            />
          </div>
        </div>

        <div className="h-24 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={30}
                outerRadius={42}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
              >
                <Cell fill={chartColors[color]} />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;