import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/api.js";
import { CATEGORIES, formatCurrency } from "../utils/format.js";
import ExpenseTable from "../components/ExpenseTable.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import CategoryPie from "../components/CategoryPie.jsx";
import Modal from "../components/Modal.jsx";

// Sum all expenses by category (fixed order), dropping empty categories.
function spendingByCategory(expenses) {
  const totals = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
  });
  return CATEGORIES.filter((c) => totals[c]).map((c) => ({
    category: c,
    amount: totals[c],
  }));
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state: null = closed, {} = adding, {expense} = editing.
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load all expenses on mount.
  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Open the form to add a new expense.
  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  // Open the form pre-filled to edit an existing expense.
  function handleEdit(expense) {
    setEditing(expense);
    setShowForm(true);
  }

  // Create or update, then refresh the list.
  async function handleSubmit(values) {
    try {
      if (editing) {
        await updateExpense(editing.id, values);
      } else {
        await createExpense(values);
      }
      setShowForm(false);
      setEditing(null);
      await loadExpenses();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(expense) {
    if (!window.confirm(`Delete "${expense.name}"?`)) return;
    try {
      await deleteExpense(expense.id);
      await loadExpenses();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="page-note">Loading expenses…</p>;
  if (error) return <p className="page-note error">{error}</p>;

  const chartData = spendingByCategory(expenses);
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Expenses</h1>
          <p className="page-subtitle">
            {expenses.length} transactions · {formatCurrency(total)} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add expense
        </button>
      </header>

      <section className="card">
        <h2 className="card-title">Spending breakdown</h2>
        <CategoryPie data={chartData} />
      </section>

      <section className="card">
        <h2 className="card-title">All transactions</h2>
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {showForm && (
        <Modal
          title={editing ? "Edit expense" : "Add expense"}
          onClose={() => setShowForm(false)}
        >
          <ExpenseForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
