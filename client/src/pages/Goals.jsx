import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../services/api.js";
import GoalCard from "../components/GoalCard.jsx";
import GoalForm from "../components/GoalForm.jsx";
import Modal from "../components/Modal.jsx";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(goal) {
    setEditing(goal);
    setShowForm(true);
  }

  async function handleSubmit(values) {
    try {
      if (editing) {
        await updateGoal(editing.id, values);
      } else {
        await createGoal(values);
      }
      setShowForm(false);
      setEditing(null);
      await loadGoals();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(goal) {
    if (!window.confirm(`Delete "${goal.name}"?`)) return;
    try {
      await deleteGoal(goal.id);
      await loadGoals();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="page-note">Loading goals…</p>;
  if (error) return <p className="page-note error">{error}</p>;

  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Financial Goals</h1>
          <p className="page-subtitle">Track progress toward what matters</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add goal
        </button>
      </header>

      {goals.length === 0 ? (
        <p className="empty-note">No goals yet. Add your first one!</p>
      ) : (
        <section className="goal-grid">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}

      {showForm && (
        <Modal
          title={editing ? "Update goal" : "Add goal"}
          onClose={() => setShowForm(false)}
        >
          <GoalForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
