import api from "../services/api";

export default function ExpenseList({ expenses, onExpenseDeleted }) {
  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/expense/delete-expense/${id}`, {
        headers: { Authorization: token },
      });

      // Notify parent (Dashboard)
      onExpenseDeleted(id);
    } catch (error) {
      console.error("Delete failed", error);
    }
  }

  if (expenses.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-4">
        No expenses added yet.
      </p>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Expenses
      </h2>

      <ul className="space-y-3">
        {expenses.map((expense) => (
          <li
            key={expense._id}
            className="flex justify-between items-center bg-gray-700 p-3 rounded"
          >
            <div className="text-gray-200">
              <p className="font-semibold">
                ₹{expense.expenseamount}
              </p>
              <p className="text-sm text-gray-400">
                {expense.description} — {expense.category}
              </p>
            </div>

            <button
              onClick={() => handleDelete(expense._id)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
