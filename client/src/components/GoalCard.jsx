import { formatCurrency } from "../utils/format.js";

// A single goal card showing progress toward the target.
export default function GoalCard({ goal, onEdit, onDelete }) {
  // Completion percentage, capped at 100 for the progress bar width.
  const rawPercent =
    goal.target_amount > 0
      ? (goal.current_amount / goal.target_amount) * 100
      : 0;
  const percent = Math.round(rawPercent);
  const barWidth = Math.min(percent, 100);
  const isComplete = goal.current_amount >= goal.target_amount;

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <h3>{goal.name}</h3>
        {isComplete && <span className="goal-badge">Complete</span>}
      </div>

      <p className="goal-amounts">
        {formatCurrency(goal.current_amount)}
        <span className="goal-target"> of {formatCurrency(goal.target_amount)}</span>
      </p>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="goal-percent">{percent}% funded</p>

      <div className="goal-card-actions">
        <button className="btn-link" onClick={() => onEdit(goal)}>
          Update
        </button>
        <button
          className="btn-link btn-link-danger"
          onClick={() => onDelete(goal)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
