import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MakePaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [reminderId, setReminderId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReminders = async () => {
      const res = await fetch(`${API_URL}/api/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }

      if (!res.ok) {
        onSuccess(); // Notify parent to refresh on error as well
      }
    };
    fetchReminders();
  }, [token]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("➡️ Sending payment:", { reminderId, amount });

    try {
      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reminderId, amount }),
      });

      if (res.ok) {
        setMessage("✅ Payment successful!");
        setReminderId("");
        setAmount("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Error making payment");
      }
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <h2 className="text-2xl font-bold text-green-700">Make Payment</h2>

      {/* Dropdown for reminder selection */}
      <select
        value={reminderId}
        onChange={(e) => setReminderId(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="">Select Reminder</option>
        {reminders.map((r) => (
          <option key={r._id} value={r._id}>
            {r.title} - ${r.amount} (Due {new Date(r.dueDate).toLocaleDateString()})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg">
        Pay
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
