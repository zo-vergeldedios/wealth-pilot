import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_COLORS, formatCurrency } from "../utils/format.js";

// Donut chart showing each category's share of a total.
// `data` is an array of { category, amount }.
// `colors` maps a category to its hue (defaults to the expense palette).
// `emptyNote` is the message shown when there's nothing to chart.
// A legend labels every slice, so slices are identified by text, not color alone.
export default function CategoryPie({
  data,
  colors = CATEGORY_COLORS,
  emptyNote = "No spending to break down yet.",
}) {
  if (!data || data.length === 0) {
    return <p className="empty-note">{emptyNote}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          stroke="#26282a"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={colors[entry.category] || "#8a8d86"}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 13, color: "#c2c4be" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
