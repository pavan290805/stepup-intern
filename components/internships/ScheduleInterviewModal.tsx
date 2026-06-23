import { useState } from "react";

type ScheduleInterviewModalProps = {
  applicantName: string;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
};

export default function ScheduleInterviewModal({
  applicantName,
  onClose,
  onSchedule,
}: ScheduleInterviewModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    // Validate date is in the future
    const selectedDate = new Date(`${date}T${time}`);
    if (selectedDate <= new Date()) {
      setError("Please select a future date and time");
      return;
    }

    onSchedule(date, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Schedule Interview with {applicantName}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interview Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interview Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
