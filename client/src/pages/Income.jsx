import { useEffect, useState } from "react";
import {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../services/api.js";
import {
  INCOME_CATEGORIES,
  INCOME_CATEGORY_COLORS,
  formatCurrency,
} from "../utils/format.js";
import IncomeTable from "../components/IncomeTable.jsx";
import IncomeForm from "../components/IncomeForm.jsx";
import CategoryPie from "../components/CategoryPie.jsx";
import Modal from "../components/Modal.jsx";

// Sum all income by category (fixed order), dropping empty categories.
function incomeByCategory(income) {
  const totals = {};
  income.forEach((i) => {
    totals[i.category] = (totals[i.category] || 0) + Number(i.amount);
  });
  return INCOME_CATEGORIES.filter((c) => totals[c]).map((c) => ({
    category: c,
    amount: totals[c],
  }));
}

export default function Income() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state: null = closed, {} = adding, {entry} = editing.
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load all income on mount.
  useEffect(() => {
    loadIncome();
  }, []);

  async function loadIncome() {
    try {
      const data = await getIncome();
      setIncome(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Open the form to add a new income entry.
  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  // Open the form pre-filled to edit an existing entry.
  function handleEdit(entry) {
    setEditing(entry);
    setShowForm(true);
  }

  // Create or update, then refresh the list.
  async function handleSubmit(values) {
    try {
      if (editing) {
        await updateIncome(editing.id, values);
      } else {
        await createIncome(values);
      }
      setShowForm(false);
      setEditing(null);
      await loadIncome();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Delete "${entry.source}"?`)) return;
    try {
      await deleteIncome(entry.id);
      await loadIncome();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="page-note">Loading income…</p>;
  if (error) return <p className="page-note error">{error}</p>;

  const chartData = incomeByCategory(income);
  const total = income.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Income</h1>
          <p className="page-subtitle">
            {income.length} entries · {formatCurrency(total)} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add income
        </button>
      </header>

      <section className="card">
        <h2 className="card-title">Income by source</h2>
        <CategoryPie
          data={chartData}
          colors={INCOME_CATEGORY_COLORS}
          emptyNote="No income to break down yet."
        />
      </section>

      <section className="card">
        <h2 className="card-title">All income</h2>
        <IncomeTable
          income={income}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {showForm && (
        <Modal
          title={editing ? "Edit income" : "Add income"}
          onClose={() => setShowForm(false)}
        >
          <IncomeForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
