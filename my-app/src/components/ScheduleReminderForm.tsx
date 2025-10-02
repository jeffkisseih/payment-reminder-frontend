import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ScheduleReminderForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { token } = useAuth(); // ✅ get token from context

  const API_URL = import.meta.env.VITE_API_URL ;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to schedule a reminder.");
      return;
    }

    const res = await fetch(`${API_URL}/api/reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // ✅ attach token
      },
      body: JSON.stringify({ title, amount, dueDate }),
    });

    if (res.ok) {
      alert("Reminder scheduled!");
      setTitle("");
      setAmount("");
      setDueDate("");
      onSuccess(); // Notify parent to refresh on success
    } else {
      const error = await res.json();
      alert(`Failed: ${error.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Reminder Form</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Schedule Reminder
      </button>
    </form>
  );
}
