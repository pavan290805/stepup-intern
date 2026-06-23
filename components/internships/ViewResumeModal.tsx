type ViewResumeModalProps = {
  applicantName: string;
  resumeUrl: string;
  onClose: () => void;
};

export default function ViewResumeModal({
  applicantName,
  resumeUrl,
  onClose,
}: ViewResumeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md">
      <div className="mx-4 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl max-h-[calc(100vh-3rem)]">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            {applicantName}'s Resume
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 transition hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="h-[75vh] overflow-hidden p-6">
          <iframe
            src={resumeUrl}
            title={`${applicantName} Resume`}
            className="h-full w-full rounded-[1.25rem] border border-slate-200 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200/70 px-6 py-5 bg-white/80">
          <a
            href={resumeUrl}
            download
            className="inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Download Resume
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
