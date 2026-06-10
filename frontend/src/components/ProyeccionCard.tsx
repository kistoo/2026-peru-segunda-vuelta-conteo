import type { Proyeccion } from '../types/resultados';
import { fmtVotos } from '../lib/format';

interface ProyeccionCardProps {
  data: Proyeccion;
}

export function ProyeccionCard({ data }: ProyeccionCardProps) {
  const diffAbs  = Math.abs(data.diff);
  const keiLeads = data.diff >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">📊</div>
        <div>
          <p className="font-bold text-[#003870] text-sm">Proyección C + JEE</p>
          <p className="text-xs text-slate-400 mt-0.5">Si el JEE aprueba las actas tal como están</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <CandRow
          label="Keiko Fujimori"
          votos={data.keiko_votos}
          pct={data.keiko_pct}
          color="orange"
        />
        <CandRow
          label="Roberto Sánchez"
          votos={data.sanchez_votos}
          pct={data.sanchez_pct}
          color="red"
        />

        {/* Big bar */}
        <div className="h-7 rounded-full overflow-hidden flex mt-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
            style={{ width: `${data.keiko_pct}%` }}
          >
            {data.keiko_pct.toFixed(2)}%
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 flex-1 flex items-center justify-center text-white text-xs font-bold">
            {data.sanchez_pct.toFixed(2)}%
          </div>
        </div>

        <div className="flex justify-between text-xs text-slate-400">
          <span className="text-orange-500 font-semibold">■ Keiko (FP)</span>
          <span className={`font-bold text-sm ${keiLeads ? 'text-orange-600' : 'text-red-700'}`}>
            {keiLeads ? 'Keiko' : 'Sánchez'} +{fmtVotos(diffAbs)} votos
          </span>
          <span className="text-red-600 font-semibold">Roberto (JPP) ■</span>
        </div>
      </div>
    </div>
  );
}

interface CandRowProps { label: string; votos: number; pct: number; color: 'red' | 'orange' }

function CandRow({ label, votos, pct, color }: CandRowProps) {
  const c = color === 'orange'
    ? { text: 'text-orange-600', bar: 'bg-orange-400' }
    : { text: 'text-red-700',    bar: 'bg-red-500'    };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className={`font-semibold ${c.text}`}>{label}</span>
        <span className="text-slate-700 font-bold">{votos.toLocaleString('es-PE')}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
