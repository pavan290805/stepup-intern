import { memo, useCallback, useState } from "react";

type SendEmailModalProps = {
  applicantName: string;
  applicantEmail: string;
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
};

function SendEmailModal({
  applicantName,
  applicantEmail,
  onClose,
  onSend,
}: SendEmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubjectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubject(e.target.value);
      setError("");
    },
    []
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      setError("");
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!subject.trim() || !message.trim()) {
        setError("Subject and message are required");
        return;
      }

      onSend(subject, message);
      onClose();
    },
    [subject, message, onSend, onClose]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Send Email to {applicantName}
        </h3>

        <p className="mb-4 text-sm text-slate-600">
          To: {applicantEmail}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={handleSubjectChange}
              placeholder="Email subject"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Message
            </label>

            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Write your email message..."
              rows={6}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

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
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(SendEmailModal);