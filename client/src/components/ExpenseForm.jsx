import { useState } from "react";
import api from "../services/api";

export default function ExpenseForm({ onExpenseAdded }) {
    const [form, setForm] = useState({
        expenseamount: "",
        description: "",
        category: "food"
    })

    const [error, setError] = useState("")

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("")

        try {
            let token = localStorage.getItem("token")
            console.log("Token:", token);

            const { data } = await api.post(
                "/expense/add-expense",
                form,
                {
                    headers: { Authorization: token },
                }
            )
            console.log("Expense added:", data);

            onExpenseAdded(data.expense)

            setForm({
                expenseamount : "",
                description : "",
                category : "food"
            })
        } catch(error){
            setError(error.response?.data?.message || "Error adding expense")
        }
    }
    return (
       <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Add Expense
            </h2>

            {error && (
                <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" >
                {/* Expense amount */}
                <div>
                    <label className="block text-gray-300 mb-1" >Expense Amount</label>
                    <input
                        type="number"
                        name="expenseamount"
                        value={form.expenseamount}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white rounded outline-none"
                        required
                    />
                </div>
                {/* Description  */}
                <div>
                    <label className="block text-gray-300 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full bg-gray-700 rounded outline-none p-3 text-white"
                        required
                    />
                </div>
                {/* category */}
                <div>
                    <label className="block text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-3 text-white bg-gray-700 rounded outline=none"
                    >
                        <option value="fuel">Fuel</option>
                        <option value="food">Food</option>
                        <option value="electricity">Electricity</option>
                        <option value="movie">Movie</option>
                    </select>
                </div>
                {/* submit */}
                <button type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semobold">
                    Add Expense
                </button>
            </form>
        </div>
    )
}