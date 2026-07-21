import { useState } from "react";

// Form for creating or editing a financial goal.
// If `initial` is provided we're editing; otherwise we're adding a new one.
export default function GoalForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [targetAmount, setTargetAmount] = useState(initial?.target_amount || "");
  const [currentAmount, setCurrentAmount] = useState(
    initial?.current_amount || ""
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return setError("Please enter a name.");
    if (!targetAmount || Number(targetAmount) <= 0)
      return setError("Target amount must be greater than 0.");
    if (Number(currentAmount) < 0)
      return setError("Current amount cannot be negative.");

    setError("");
    onSubmit({
      name: name.trim(),
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount) || 0,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Goal name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Emergency Fund"
        />
      </label>

      <label className="form-field">
        <span>Target amount</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <label className="form-field">
        <span>Current amount</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          placeholder="0.00"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? "Save changes" : "Add goal"}
        </button>
      </div>
    </form>
  );
}
