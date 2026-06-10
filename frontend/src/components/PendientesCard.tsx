import type { Pendientes, Proyeccion } from '../types/resultados';
import { fmtVotos } from '../lib/format';

interface PendientesCardProps {
  data: Pendientes;
  proyeccion: Proyeccion;
}

export function PendientesCard({ data, proyeccion }: PendientesCardProps) {
  const diffAbs        = Math.abs(proyeccion.diff);
  const keiLeads       = proyeccion.diff >= 0;
  const whoNeeds       = keiLeads ? 'Sánchez' : 'Keiko';
  const diffColor      = keiLeads ? 'text-orange-600' : 'text-red-700';
  const pctNeeded      = data.votos_est > 0
    ? (((diffAbs / 2 + data.votos_est / 2) / data.votos_est) * 100).toFixed(0)
    : '—';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">⏳</div>
        <div>
          <p className="font-bold text-[#003870] text-sm">
            Actas pendientes —{' '}
            <span className="text-slate-500">{fmtVotos(data.actas)} actas</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Sin digitizar. Estimación proporcional.</p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-2">
          {[
            { label: 'Votos estimados',       value: `~${fmtVotos(data.votos_est)}`, color: '' },
            { label: 'Keiko Fujimori est.',   value: `~${fmtVotos(data.keiko_est)}`, color: 'text-orange-600' },
            { label: 'Roberto Sánchez est.',  value: `~${fmtVotos(data.sanchez_est)}`, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
              <span className={`text-slate-500 ${color}`}>{label}</span>
              <span className="font-bold text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 px-3 py-2.5 rounded-r-lg text-xs text-amber-900 leading-relaxed">
          ⚠️ Para revertir la diferencia de{' '}
          <strong className={diffColor}>+{fmtVotos(diffAbs)} votos</strong>,{' '}
          {whoNeeds} necesitaría ~{pctNeeded}% de las{' '}
          {fmtVotos(data.actas)} actas restantes.{' '}
          Las {fmtVotos(data.actas)} actas solo generan ~{fmtVotos(data.votos_est)} votos en total.
        </div>
      </div>
    </div>
  );
}
