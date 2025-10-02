import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ScheduleReminderForm from "../components/ScheduleReminderForm";
import MakePaymentForm from "../components/MakePaymentForm";
import PaymentSummary from "../components/PaymentSummary";

export default function Dashboard() {
  const [reminders, setReminders] = useState<any[]>([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Modal states
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

const handleSuccess = () => {
  setRefreshTrigger((prev) => prev + 1); // ✅ re-fetch summary and reminders
};

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReminders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reminders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reminders");
        const data = await res.json();

        // ✅ Only show unpaid reminders
        setReminders(data.filter((r: any) => !r.isPaid));
      } catch (err) {
        console.error("Error fetching reminders:", err);
      }
    };

    fetchReminders();
  }, [token, navigate]);

  return (
    <div className="p-3">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-x-4">
        <button
          onClick={() => setIsScheduleOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Schedule Reminder
        </button>
        <button
          onClick={() => setIsPaymentOpen(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow"
        >
          Pay Now
        </button>
      </div>

      {/* Reminders list with progress */}
      <ul className="mt-6 space-y-2">
        {reminders.map((r) => (
          <li key={r._id} className="p-4 bg-blue-100 rounded-lg">
            <p className="font-bold">{r.title}</p>
            <p>
              Paid: ${r.amountPaid ?? 0} / ${r.amount}
              {r.isPaid
                ? " ✅ Fully Paid"
                : ` — Remaining: $${r.amount - (r.amountPaid ?? 0)}`}
            </p>
            <p>Due: {new Date(r.dueDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      {/* Modals */}
      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)}>
        <ScheduleReminderForm onSuccess={handleSuccess} />
      </Modal>

      <Modal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)}>
        <MakePaymentForm onSuccess={handleSuccess} />
      </Modal>

      {/* Payment summary */}
      <PaymentSummary refreshTrigger={refreshTrigger} />
    </div>
  );
}


