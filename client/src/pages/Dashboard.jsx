import { useEffect, useState } from "react";
import { getProfile, getExpenses } from "../services/api.js";
import {
  formatCurrency,
  CATEGORIES,
} from "../utils/format.js";
import SummaryCard from "../components/SummaryCard.jsx";
import SpendingChart from "../components/SpendingChart.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";

// Returns true if a YYYY-MM-DD date falls in the current calendar month.
function isThisMonth(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  );
}

// Sum this month's expenses grouped by category, in the fixed CATEGORIES order.
// Categories with no spending are dropped so the chart stays clean.
function spendingByCategory(expenses) {
  const totals = {};
  expenses
    .filter((e) => isThisMonth(e.date))
    .forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });

  return CATEGORIES.filter((c) => totals[c]).map((c) => ({
    category: c,
    amount: totals[c],
  }));
}

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // Load profile and expenses together.
        const [profileData, expenseData] = await Promise.all([
          getProfile(),
          getExpenses(),
        ]);
        setProfile(profileData);
        setExpenses(expenseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="page-note">Loading dashboard…</p>;
  if (error) return <p className="page-note error">{error}</p>;

  // Derived numbers for the summary cards.
  const monthlyExpenses = expenses
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const income = Number(profile.income) || 0;
  const savingsRate =
    income > 0 ? Math.round(((income - monthlyExpenses) / income) * 100) : 0;

  const chartData = spendingByCategory(expenses);
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Your financial overview at a glance</p>
      </header>

      <section className="summary-grid">
        <SummaryCard label="Net Worth" value={formatCurrency(profile.net_worth)} />
        <SummaryCard
          label="Monthly Income"
          value={formatCurrency(income)}
          accent="positive"
        />
        <SummaryCard
          label="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
        />
        <SummaryCard label="Savings Rate" value={`${savingsRate}%`} accent="positive" />
        <SummaryCard
          label="Investments"
          value={formatCurrency(profile.investments)}
        />
        <SummaryCard
          label="Debt"
          value={formatCurrency(profile.debt)}
          accent="negative"
        />
      </section>

      <section className="card">
        <h2 className="card-title">Spending this month</h2>
        <SpendingChart data={chartData} />
      </section>

      <section className="card">
        <h2 className="card-title">Recent expenses</h2>
        <ExpenseTable expenses={recentExpenses} />
      </section>
    </div>
  );
}
