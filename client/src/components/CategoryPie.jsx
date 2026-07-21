import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_COLORS, formatCurrency } from "../utils/format.js";

// Donut chart showing each category's share of total spending.
// `data` is an array of { category, amount }.
// A legend labels every slice, so slices are identified by text, not color alone.
export default function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-note">No spending to break down yet.</p>;
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
          stroke="#fcfcfb"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={CATEGORY_COLORS[entry.category] || "#898781"}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 13, color: "#52514e" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
