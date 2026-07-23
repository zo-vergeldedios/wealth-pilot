import { useState } from "react";
import { INCOME_CATEGORIES } from "../utils/format.js";

// Form for creating or editing an income entry.
// If `initial` is provided we're editing; otherwise we're adding a new one.
// `onSubmit` receives the form values; `onCancel` closes without saving.
export default function IncomeForm({ initial, onSubmit, onCancel }) {
  const [source, setSource] = useState(initial?.source || "");
  const [amount, setAmount] = useState(initial?.amount || "");
  const [category, setCategory] = useState(
    initial?.category || INCOME_CATEGORIES[0]
  );
  const [date, setDate] = useState(initial?.date || today());
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!source.trim()) return setError("Please enter a source.");
    if (!amount || Number(amount) <= 0)
      return setError("Amount must be greater than 0.");
    if (!date) return setError("Please pick a date.");

    setError("");
    onSubmit({ source: source.trim(), amount: Number(amount), category, date });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Source</span>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. Monthly salary"
        />
      </label>

      <label className="form-field">
        <span>Amount</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <label className="form-field">
        <span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {INCOME_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? "Save changes" : "Add income"}
        </button>
      </div>
    </form>
  );
}

// Today's date as YYYY-MM-DD for the default date input value.
function today() {
  return new Date().toISOString().slice(0, 10);
}
