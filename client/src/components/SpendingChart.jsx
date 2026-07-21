import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { CATEGORY_COLORS, formatCurrency } from "../utils/format.js";

// Bar chart of spending totals by category.
// `data` is an array of { category, amount }.
// Each bar is tinted with its category color, but the category is also named
// on the x-axis, so color is a reinforcement rather than the only signal.
export default function SpendingChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-note">No spending to chart yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid vertical={false} stroke="#e1e0d9" />
        <XAxis
          dataKey="category"
          tick={{ fill: "#52514e", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#c3c2b7" }}
        />
        <YAxis
          tick={{ fill: "#898781", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), "Spent"]}
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={CATEGORY_COLORS[entry.category] || "#898781"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
