import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-12 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">404</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900">Page not found</h1>
          <p className="mt-4 text-sm text-gray-500">The page you are looking for does not exist, or the link is broken.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition-all"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
