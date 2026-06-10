import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResultadosResponse, StatusLive } from '../types/resultados';

// En dev: VITE_API_URL=http://localhost:3000 → llama al NestJS directamente
// En Docker: VITE_API_URL=""              → nginx hace el proxy a /resultados
const API_BASE = import.meta.env.VITE_API_URL ?? '';
const REFRESH_INTERVAL_MS = 120_000;

interface UseResultadosReturn {
  data: ResultadosResponse | null;
  status: StatusLive;
  lastUpdated: string | null;
  refresh: () => void;
}

export function useResultados(): UseResultadosReturn {
  const [data, setData] = useState<ResultadosResponse | null>(null);
  const [status, setStatus] = useState<StatusLive>('idle');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/resultados`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ResultadosResponse = await res.json();
      setData(json);
      setLastUpdated(json.ts);
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { data, status, lastUpdated, refresh: fetchData };
}
