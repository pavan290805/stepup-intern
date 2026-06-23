import Header from "../Components/RecruiterPage/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0880EF]">Contact Us</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Let’s build your talent engine</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Reach out for support, feature requests, or help customizing your internship management workflow with StepUp Intern.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6">
              <h2 className="text-xl font-semibold text-slate-900">Email</h2>
              <p className="mt-3 text-sm text-slate-600">support@stepupintern.com</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6">
              <h2 className="text-xl font-semibold text-slate-900">Phone</h2>
              <p className="mt-3 text-sm text-slate-600">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

