import type { StatusLive } from '../types/resultados';

interface NavbarProps {
  status: StatusLive;
  lastUpdated: string | null;
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<StatusLive, { color: string; label: string; animate: boolean }> = {
  idle:    { color: 'bg-slate-400',  label: 'Iniciando…',    animate: false },
  loading: { color: 'bg-yellow-400', label: 'Actualizando…', animate: true  },
  ok:      { color: 'bg-green-400',  label: 'En vivo',       animate: true  },
  error:   { color: 'bg-red-400',    label: 'Sin conexión',   animate: false },
};

export function Navbar({ status, lastUpdated, onRefresh }: NavbarProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <nav className="bg-[#003870] sticky top-0 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <span className="bg-red-600 text-white font-black text-sm px-2 py-1 rounded tracking-wide">
            ONPE
          </span>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm leading-none">Segunda Elección Presidencial</p>
            <p className="text-blue-200 text-xs">7 de junio de 2026</p>
          </div>
        </a>

        <div className="flex-1" />

        {/* Status */}
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${cfg.color} ${cfg.animate ? 'animate-pulse' : ''}`}
          />
          <span className="hidden sm:inline">
            {status === 'ok' && lastUpdated ? `En vivo · ${lastUpdated}` : cfg.label}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={status === 'loading'}
          className="ml-2 border border-white/30 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
        >
          ↻ Actualizar
        </button>
      </div>
    </nav>
  );
}
