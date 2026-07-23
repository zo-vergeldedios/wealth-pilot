import {
  formatCurrency,
  formatDate,
  INCOME_CATEGORY_COLORS,
} from "../utils/format.js";

// Table of income entries with edit/delete actions.
// `onEdit` and `onDelete` are optional — when omitted (e.g. the dashboard's
// "recent income" preview) the actions column is hidden.
export default function IncomeTable({ income, onEdit, onDelete }) {
  if (!income || income.length === 0) {
    return <p className="empty-note">No income yet.</p>;
  }

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Category</th>
            <th>Date</th>
            <th className="align-right">Amount</th>
            {showActions && <th className="align-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {income.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.source}</td>
              <td>
                <span className="category-badge">
                  <span
                    className="category-dot"
                    style={{
                      backgroundColor:
                        INCOME_CATEGORY_COLORS[entry.category] || "#8a8d86",
                    }}
                  />
                  {entry.category}
                </span>
              </td>
              <td>{formatDate(entry.date)}</td>
              <td className="align-right amount amount-positive">
                {formatCurrency(entry.amount)}
              </td>
              {showActions && (
                <td className="align-right">
                  <button className="btn-link" onClick={() => onEdit(entry)}>
                    Edit
                  </button>
                  <button
                    className="btn-link btn-link-danger"
                    onClick={() => onDelete(entry)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
