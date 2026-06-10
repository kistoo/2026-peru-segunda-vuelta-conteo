export interface CandidatoOficial {
  keiko_votos: number;
  keiko_pct: number;
  sanchez_votos: number;
  sanchez_pct: number;
  diff: number;
}

export interface JeeData {
  actas_jee: number;
  actas_pend: number;
  keiko_jee: number;
  sanchez_jee: number;
  nulos_jee: number;
  blancos_jee: number;
  impug_jee: number;
  fuente: string;
}

export interface Proyeccion {
  keiko_votos: number;
  keiko_pct: number;
  sanchez_votos: number;
  sanchez_pct: number;
  diff: number;
}

export interface Pendientes {
  actas: number;
  votos_est: number;
  keiko_est: number;
  sanchez_est: number;
}

export interface ResultadosResponse {
  ts: string;
  cache_ttl: number;
  oficiales: CandidatoOficial;
  jee: JeeData;
  proyeccion: Proyeccion;
  pendientes: Pendientes;
}

export type StatusLive = 'idle' | 'loading' | 'ok' | 'error';
