import { useEffect, useState } from "react";
import api from "../services/api";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Pagination from "../components/Pagination";
import PremiumSection from "../components/PremiumSection";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [pageData, setPageData] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(
    Number(localStorage.getItem("number")) || 5
  );

  /* ---------- LOGOUT ---------- */
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("number");
    window.location.href = "/login";
  }

  /* ---------- FETCH EXPENSES ---------- */
  async function fetchExpenses(pageNumber = page, pageLimit = limit) {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get(
        `/expense/get-expenses?page=${pageNumber}&number=${pageLimit}`,
        {
          headers: { Authorization: token },
        }
      );

      setExpenses(data.expenses);
      setPageData(data.pageData);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  }

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchExpenses(1, limit);
  }, []);

  /* ---------- AFTER ADD ---------- */
  function handleExpenseAdded() {
    fetchExpenses(page, limit);
  }

  /* ---------- AFTER DELETE ---------- */
  function handleExpenseDeleted(id) {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white relative">

      {/* ---------- HEADER ---------- */}

      <div className="relative flex items-center mb-6">
        {/* Center Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          Expense Dashboard
        </h1>

        {/* Right Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
        >
          Logout
        </button>
      </div>

      <ExpenseForm onExpenseAdded={handleExpenseAdded} />

      <ExpenseList
        expenses={expenses}
        onExpenseDeleted={handleExpenseDeleted}
      />

      <Pagination
        pageData={pageData}
        limit={limit}
        onPageChange={(p) => fetchExpenses(p, limit)}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          localStorage.setItem("number", newLimit);
          fetchExpenses(1, newLimit);
        }}
      />

      <PremiumSection />
    </div>
  );
}
