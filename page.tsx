"use client";
import { useEffect, useState } from "react";
import ScheduleForm from "../components/ScheduleForm";

interface Reminder {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  email: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = async () => {
    const res = await fetch("http://localhost:5000/api/reminders");
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">📌 Reminders</h1>
      <ScheduleForm onSuccess={fetchReminders} />
      <ul className="mt-6 space-y-2">
        {reminders.map((r) => (
          <li key={r._id} className="p-4 border rounded-lg">
            <p className="font-bold">{r.title}</p>
            <p>Amount: ${r.amount}</p>
            <p>Due: {new Date(r.dueDate).toDateString()}</p>
            <p>Email: {r.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
