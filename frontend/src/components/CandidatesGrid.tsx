import type { CandidatoOficial } from '../types/resultados';
import { fmtVotos, fmtPct } from '../lib/format';

interface CandidatesGridProps {
  data: CandidatoOficial;
}

export function CandidatesGrid({ data }: CandidatesGridProps) {
  const diffAbs = Math.abs(data.diff);
  const sanchezLeads = data.diff < 0; // diff = keiko - sanchez; negative means sanchez leads

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Roberto Sánchez */}
        <CandidateCard
          initials="RS"
          pct={data.sanchez_pct}
          votos={data.sanchez_votos}
          name="Roberto Helbert Sánchez Palomino"
          party="Juntos por el Perú"
          colorClass="red"
          borderClass="sm:border-r border-slate-200"
        />
        {/* Keiko Fujimori */}
        <CandidateCard
          initials="KF"
          pct={data.keiko_pct}
          votos={data.keiko_votos}
          name="Keiko Sofía Fujimori Higuchi"
          party="Fuerza Popular"
          colorClass="orange"
        />
      </div>

      {/* Diff strip */}
      <div className="border-t border-slate-200 bg-gradient-to-r from-blue-50 to-red-50 px-5 py-2.5 flex justify-between items-center text-sm">
        <span className="text-slate-500">Diferencia oficial (actas contabilizadas)</span>
        <span className={`font-bold ${sanchezLeads ? 'text-red-700' : 'text-orange-600'}`}>
          {sanchezLeads
            ? `Sánchez +${fmtVotos(diffAbs)} votos`
            : `Keiko +${fmtVotos(diffAbs)} votos`}
        </span>
      </div>
    </div>
  );
}

interface CandidateCardProps {
  initials: string;
  pct: number;
  votos: number;
  name: string;
  party: string;
  colorClass: 'red' | 'orange';
  borderClass?: string;
}

function CandidateCard({ initials, pct, votos, name, party, colorClass, borderClass = '' }: CandidateCardProps) {
  const colors = {
    red: {
      avatar:   'bg-gradient-to-br from-red-600 to-red-900',
      pct:      'text-red-700',
      bar:      'bg-gradient-to-r from-red-600 to-red-400',
    },
    orange: {
      avatar:   'bg-gradient-to-br from-orange-500 to-orange-700',
      pct:      'text-orange-600',
      bar:      'bg-gradient-to-r from-orange-500 to-orange-300',
    },
  }[colorClass];

  return (
    <div className={`p-6 flex flex-col gap-1 ${borderClass}`}>
      <div className={`w-13 h-13 rounded-full ${colors.avatar} text-white font-black text-lg flex items-center justify-center mb-3 w-12 h-12`}>
        {initials}
      </div>

      <p className={`text-4xl font-black leading-none ${colors.pct}`}>
        {fmtPct(pct)}
      </p>

      <p className="font-bold text-sm uppercase tracking-wide text-slate-800 mt-2">{name}</p>
      <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">{party}</p>

      {/* Bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-3 space-y-1">
        <StatRow label="Cantidad de votos" value={fmtVotos(votos)} />
        <StatRow label="% Votos válidos"   value={fmtPct(pct)} />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <strong className="text-slate-800">{value}</strong>
    </div>
  );
}
