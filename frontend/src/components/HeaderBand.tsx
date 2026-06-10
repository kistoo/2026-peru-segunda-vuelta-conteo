interface HeaderBandProps {
  cContabilizadas: number;
  cJee: number;
  cPendientes: number;
  total: number;
  timestamp: string | null;
}

export function HeaderBand({ cContabilizadas, cJee, cPendientes, total, timestamp }: HeaderBandProps) {
  const pctC   = total > 0 ? (cContabilizadas / total) * 100 : 0;
  const pctJee = total > 0 ? (cJee / total) * 100 : 0;
  const pctP   = total > 0 ? (cPendientes / total) * 100 : 0;

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h1 className="text-[#003870] font-bold text-lg flex items-center gap-2">
          <span>🗳️</span> Elección de Fórmula Presidencial
        </h1>

        <div className="mt-3 flex flex-wrap gap-5 items-end">
          <div>
            <p className="text-4xl font-black text-[#003870] leading-none">{pctC.toFixed(3)} %</p>
            <p className="text-sm text-slate-500 mt-1">
              Actas contabilizadas · <strong className="text-slate-700">Total: {total.toLocaleString('es-PE')}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Pill color="green" label="Contabilizadas" value={cContabilizadas} />
            <Pill color="orange" label="Para envío al JEE" value={cJee} />
            <Pill color="slate" label="Pendientes" value={cPendientes} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-600 h-full transition-all duration-700"
            style={{ width: `${pctC}%` }}
          />
          <div
            className="bg-orange-500 h-full transition-all duration-700"
            style={{ width: `${pctJee}%` }}
          />
          <div
            className="bg-slate-400 h-full transition-all duration-700"
            style={{ width: `${pctP}%` }}
          />
        </div>

        {timestamp && (
          <p className="mt-2 text-xs text-slate-400">
            Actualizado al <strong className="text-slate-500">{timestamp}</strong>
            {' · '}Fuente: API ONPE · <em>Solo para análisis informativo</em>
          </p>
        )}
      </div>
    </div>
  );
}

interface PillProps { color: 'green' | 'orange' | 'slate'; label: string; value: number }

function Pill({ color, label, value }: PillProps) {
  const styles = {
    green:  'bg-green-50  text-green-800  border-green-200',
    orange: 'bg-orange-50 text-orange-800 border-orange-200',
    slate:  'bg-slate-100 text-slate-600  border-slate-200',
  };
  const dots = { green: '●', orange: '●', slate: '○' };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[color]}`}>
      {dots[color]} {label} <strong>{value.toLocaleString('es-PE')}</strong>
    </span>
  );
}
