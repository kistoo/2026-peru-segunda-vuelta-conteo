import type { JeeData } from '../types/resultados';
import { fmtVotos } from '../lib/format';

interface JeeSectionProps {
  data: JeeData;
}

export function JeeSection({ data }: JeeSectionProps) {
  const total   = data.keiko_jee + data.sanchez_jee;
  const keiPct  = total > 0 ? (data.keiko_jee / total) * 100 : 0;
  const sanPct  = 100 - keiPct;
  const diffAbs = Math.abs(data.keiko_jee - data.sanchez_jee);
  const keiLeads = data.keiko_jee >= data.sanchez_jee;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-lg">⚖️</div>
        <div>
          <p className="font-bold text-[#003870] text-sm">
            Actas enviadas al JEE —{' '}
            <span className="text-orange-600">{fmtVotos(data.actas_jee)} actas</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Ya digitadas en el sistema ONPE. El JEE decide si las aprueba, corrige o anula.
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <MiniCand
            name="Keiko Fujimori · FP"
            votos={data.keiko_jee}
            pct={keiPct}
            color="orange"
          />
          <MiniCand
            name="Roberto Sánchez · JPP"
            votos={data.sanchez_jee}
            pct={sanPct}
            color="red"
          />
        </div>

        {/* Diff */}
        <div className="mt-3 flex justify-between items-center bg-slate-50 rounded-lg px-4 py-2.5 text-sm">
          <span className="text-slate-500">Diferencia en actas JEE</span>
          <span className={`font-bold ${keiLeads ? 'text-orange-600' : 'text-red-700'}`}>
            {keiLeads ? 'Keiko' : 'Sánchez'} +{fmtVotos(diffAbs)} votos
          </span>
        </div>

        {/* Extras */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Votos Nulos',   value: data.nulos_jee   },
            { label: 'En Blanco',     value: data.blancos_jee },
            { label: 'Impugnados',    value: data.impug_jee   },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-lg text-center py-2.5 px-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="font-bold text-slate-700 mt-0.5">{fmtVotos(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MiniCandProps {
  name: string;
  votos: number;
  pct: number;
  color: 'red' | 'orange';
}

function MiniCand({ name, votos, pct, color }: MiniCandProps) {
  const styles = {
    red:    { name: 'text-red-700',    bar: 'bg-red-500',    bg: 'bg-red-50'    },
    orange: { name: 'text-orange-600', bar: 'bg-orange-400', bg: 'bg-orange-50' },
  }[color];

  return (
    <div className={`${styles.bg} rounded-lg p-3`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${styles.name} mb-1`}>{name}</p>
      <p className={`text-2xl font-black ${styles.name}`}>{fmtVotos(votos)}</p>
      <p className="text-xs text-slate-400 mb-2">{pct.toFixed(2)}%</p>
      <div className="h-1 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full ${styles.bar} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
