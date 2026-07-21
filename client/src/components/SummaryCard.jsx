// A single stat card used on the dashboard.
// `accent` lets us tint the value (e.g. green for income, red for debt).
export default function SummaryCard({ label, value, accent }) {
  return (
    <div className="summary-card">
      <p className="summary-label">{label}</p>
      <p className={`summary-value ${accent ? `accent-${accent}` : ""}`}>
        {value}
      </p>
    </div>
  );
}
