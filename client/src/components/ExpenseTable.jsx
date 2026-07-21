import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/format.js";

// Table of expenses with edit/delete actions.
// `onEdit` and `onDelete` are optional — when omitted (e.g. the dashboard's
// "recent expenses" preview) the actions column is hidden.
export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return <p className="empty-note">No expenses yet.</p>;
  }

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Date</th>
            <th className="align-right">Amount</th>
            {showActions && <th className="align-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.name}</td>
              <td>
                <span className="category-badge">
                  <span
                    className="category-dot"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[expense.category] || "#898781",
                    }}
                  />
                  {expense.category}
                </span>
              </td>
              <td>{formatDate(expense.date)}</td>
              <td className="align-right amount">
                {formatCurrency(expense.amount)}
              </td>
              {showActions && (
                <td className="align-right">
                  <button
                    className="btn-link"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-link btn-link-danger"
                    onClick={() => onDelete(expense)}
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
