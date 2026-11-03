import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function Sparkline({ data, up }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={64} height={28}>
      <LineChart data={d}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={up ? "#2B5D4C" : "#B5583A"}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
