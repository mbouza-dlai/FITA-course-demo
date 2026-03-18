import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Layout({ title = 'Recipe Vault', children, actions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-emerald-50 text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400" />
            <span className="font-semibold">Recipe Vault</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/" className={cn('px-3 py-2 rounded-lg hover:bg-slate-100 text-sm')}>Home</Link>
            <Link to="/import" className={cn('px-3 py-2 rounded-lg hover:bg-slate-100 text-sm')}>Import</Link>
            <Link to="/suggestions" className={cn('px-3 py-2 rounded-lg hover:bg-slate-100 text-sm')}>Suggestions</Link>
            <Link to="/add" className={cn('px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700')}>Add Recipe</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div>{actions}</div>
          </div>
        )}
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
