import { useResultados } from './hooks/useResultados';
import { Navbar }          from './components/Navbar';
import { HeaderBand }      from './components/HeaderBand';
import { CandidatesGrid }  from './components/CandidatesGrid';
import { JeeSection }      from './components/JeeSection';
import { ProyeccionCard }  from './components/ProyeccionCard';
import { PendientesCard }  from './components/PendientesCard';

const TOTAL_ACTAS = 92_766;

export default function App() {
  const { data, status, lastUpdated, refresh } = useResultados();

  const cJee  = data?.jee.actas_jee   ?? 1_613;
  const cPend = data?.pendientes.actas ?? 406;
  const cC    = TOTAL_ACTAS - cJee - cPend;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar status={status} lastUpdated={lastUpdated} onRefresh={refresh} />

      <HeaderBand
        cContabilizadas={cC}
        cJee={cJee}
        cPendientes={cPend}
        total={TOTAL_ACTAS}
        timestamp={lastUpdated}
      />

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-4">

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            <strong>No se pudo conectar con el servidor.</strong> Ejecuta{' '}
            <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">
              cd backend && npm run start:dev
            </code>{' '}
            y recarga la página.
          </div>
        )}

        {data ? (
          <>
            {/* [1] Resultado oficial */}
            <section>
              <SectionLabel num={1} title="Resultado oficial" sub={`${cC.toLocaleString('es-PE')} actas contabilizadas`} />
              <CandidatesGrid data={data.oficiales} />
            </section>

            {/* [2] Actas JEE */}
            <section>
              <SectionLabel num={2} title="Actas enviadas al JEE" sub={`${cJee.toLocaleString('es-PE')} actas impugnadas`} />
              <JeeSection data={data.jee} />
            </section>

            {/* [3] + [4] grid */}
            <section>
              <SectionLabel num={3} title="Proyección y pendientes" sub="Escenarios si se cuentan todas las actas" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProyeccionCard  data={data.proyeccion} />
                <PendientesCard  data={data.pendientes} proyeccion={data.proyeccion} />
              </div>
            </section>
          </>
        ) : status === 'loading' || status === 'idle' ? (
          <SkeletonLoader />
        ) : null}
      </main>

      <footer className="bg-[#003870] text-center text-xs text-blue-200 py-5 mt-4">
        <strong className="text-white">ONPE — Oficina Nacional de Procesos Electorales</strong>
        <br />
        Datos extraídos del API oficial · Solo para análisis informativo · No es fuente oficial
      </footer>
    </div>
  );
}

function SectionLabel({ num, title, sub }: { num: number; title: string; sub: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-2">
      <span className="w-5 h-5 bg-[#003870] text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
        {num}
      </span>
      <div>
        <span className="font-semibold text-slate-700 text-sm">{title}</span>
        <span className="text-slate-400 text-xs ml-2">{sub}</span>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl h-40 border border-slate-100" />
      ))}
    </div>
  );
}
