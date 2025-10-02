import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Payment {
  _id: string;
  amount: number;
  date: string;
}

interface Reminder {
  _id: string;
  title: string;
  dueDate: string;
  isPaid: boolean;
}

export default function PaymentSummary({ refreshTrigger }: { refreshTrigger: number }) {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    remindersToday: 0,
    remindersWeek: 0,
    remindersMonth: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [paymentsRes, remindersRes] = await Promise.all([
          fetch(`${API_URL}/api/payments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/reminders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
            
    console.log("Payments response:", paymentsRes.status, paymentsRes.url);
    console.log("Reminders response:", remindersRes.status, remindersRes.url);

    if (!paymentsRes.ok) {
      const text = await paymentsRes.text();
      console.error("Payments returned:", text);
      throw new Error(`Payments fetch failed: ${paymentsRes.status}`);
    }
    if (!remindersRes.ok) {
      const text = await remindersRes.text();
      console.error("Reminders returned:", text);
      throw new Error(`Reminders fetch failed: ${remindersRes.status}`);
    }

        const paymentsData = await paymentsRes.json();
        const remindersData = await remindersRes.json();

    console.log("Fetched payments:", paymentsData);
    console.log("Fetched reminders:", remindersData);
       

        setPayments(paymentsData);
        setReminders(remindersData);

        // Calculate summary
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const remindersToday = remindersData.filter((r: Reminder) => {
          const due = new Date(r.dueDate);
          return (
            due.getDate() === now.getDate() &&
            due.getMonth() === now.getMonth() &&
            due.getFullYear() === now.getFullYear() &&
            !r.isPaid
          );
        }).length;

        const remindersWeek = remindersData.filter((r: Reminder) => {
          const due = new Date(r.dueDate);
          return due >= startOfWeek && due <= endOfWeek && !r.isPaid;
        }).length;

        const remindersMonth = remindersData.filter((r: Reminder) => {
          const due = new Date(r.dueDate);
          return due >= startOfMonth && due <= endOfMonth && !r.isPaid;
        }).length;

        const totalAmount = paymentsData.reduce(
          (sum: number, p: Payment) => sum + (p.amount || 0),
          0
        );

        setSummary({
          totalPayments: paymentsData.length,
          totalAmount,
          remindersToday,
          remindersWeek,
          remindersMonth,
        });
      } catch (err) {
        console.error("Error fetching payment summary:", err);
      }
    };

    fetchData();
  }, [token, refreshTrigger]);
;


  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2 border">Metric</th>
            <th className="px-4 py-2 border">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">Payments Made</td>
            <td className="px-4 py-2 border">{summary.totalPayments}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Total Amount</td>
            <td className="px-4 py-2 border">${summary.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Reminders Due Today</td>
            <td className="px-4 py-2 border">{summary.remindersToday}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Reminders Due This Week</td>
            <td className="px-4 py-2 border">{summary.remindersWeek}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Reminders Due This Month</td>
            <td className="px-4 py-2 border">{summary.remindersMonth}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
