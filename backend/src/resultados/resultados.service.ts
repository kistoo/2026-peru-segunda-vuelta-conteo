import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import type { ResultadosResponseDto } from './dto/resultados.dto';

const execAsync = promisify(exec);

// Datos de actas JEE (resultado del script onpe_votos_jee.py · 10/06/2026)
// Se actualiza manualmente al re-ejecutar el script de Python
const CACHE_JEE = {
  actas_jee:   1613,
  actas_pend:  406,
  keiko_jee:   184_971,
  sanchez_jee: 137_313,
  nulos_jee:   19_222,
  blancos_jee: 15_614,
  impug_jee:   5_411,
  fuente:      'onpe_votos_jee.py · 10/06/2026 12:05',
} as const;

const ONPE_BASE    = 'https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend';
const ID_ELECCION  = 10;
const CACHE_TTL_MS = 120_000; // 2 minutos

interface OnpeCandidato {
  nombreAgrupacionPolitica: string;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
}

interface CachedResult {
  data: ResultadosResponseDto;
  cachedAt: number;
}

@Injectable()
export class ResultadosService {
  private readonly logger = new Logger(ResultadosService.name);
  private cache: CachedResult | null = null;

  constructor(private readonly http: HttpService) {
    // Precarga al iniciar — nunca debe lanzar una excepción no manejada
    this.getResultados().catch((err: unknown) => {
      this.logger.error(`Precarga fallida: ${String(err).slice(0, 120)}`);
    });
  }

  async getResultados(): Promise<ResultadosResponseDto> {
    const now = Date.now();

    if (this.cache && now - this.cache.cachedAt < CACHE_TTL_MS) {
      return this.cache.data;
    }

    this.logger.log('Actualizando totales oficiales desde ONPE…');
    try {
      const oficiales = await this.fetchOficiales();
      const result    = this.buildResponse(oficiales);
      this.cache = { data: result, cachedAt: now };
      this.logger.log(
        `OK — Keiko ${oficiales.keiko_votos.toLocaleString()} | Sánchez ${oficiales.sanchez_votos.toLocaleString()}`,
      );
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Error al consultar ONPE: ${msg.slice(0, 120)}`);

      // Devuelve el último caché si existe, aunque esté vencido
      if (this.cache) {
        this.logger.warn('Devolviendo datos del último caché disponible');
        return this.cache.data;
      }

      // Sin caché previo: devuelve datos base del JEE como último recurso
      return this.buildResponse({ keiko_votos: 0, keiko_pct: 0, sanchez_votos: 0, sanchez_pct: 0 });
    }
  }

  private async fetchOficiales(): Promise<{
    keiko_votos: number; keiko_pct: number;
    sanchez_votos: number; sanchez_pct: number;
  }> {
    // Intenta primero con axios; si la respuesta es HTML (TLS fingerprinting),
    // cae al adaptador Python que usa curl_cffi para imitar Chrome 124.
    let candidatos: OnpeCandidato[] = [];

    try {
      const { data } = await firstValueFrom(
        this.http.get<{ data: OnpeCandidato[] }>(
          `${ONPE_BASE}/eleccion-presidencial/participantes-ubicacion-geografica`,
          {
            params: { idEleccion: ID_ELECCION, tipoFiltro: 'eleccion' },
            headers: {
              Accept:  'application/json, text/plain, */*',
              Origin:  'https://resultadosegundavuelta.onpe.gob.pe',
              Referer: 'https://resultadosegundavuelta.onpe.gob.pe/main/presidenciales',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
            timeout: 20_000,
          },
        ),
      );
      candidatos = data.data ?? [];
    } catch {
      // Axios falló o devolvió HTML — usamos el adaptador Python
      this.logger.warn('axios no pudo obtener JSON; usando adaptador Python (curl_cffi)');
      candidatos = await this.fetchViaPython();
    }

    // Si axios devolvió pero los votos son 0, también fallback a Python
    const hasData = candidatos.some(c => (c.totalVotosValidos ?? 0) > 0);
    if (!hasData) {
      this.logger.warn('Respuesta axios sin votos; reintentando con adaptador Python');
      candidatos = await this.fetchViaPython();
    }

    const result = { keiko_votos: 0, keiko_pct: 0, sanchez_votos: 0, sanchez_pct: 0 };
    for (const c of candidatos) {
      const nombre = c.nombreAgrupacionPolitica?.toUpperCase() ?? '';
      if (nombre.includes('FUERZA POPULAR')) {
        result.keiko_votos = c.totalVotosValidos ?? 0;
        result.keiko_pct   = c.porcentajeVotosValidos ?? 0;
      } else if (nombre.includes('JUNTOS')) {
        result.sanchez_votos = c.totalVotosValidos ?? 0;
        result.sanchez_pct   = c.porcentajeVotosValidos ?? 0;
      }
    }
    return result;
  }

  /**
   * Fallback: llama al script Python que usa curl_cffi para imitar el TLS
   * fingerprint de Chrome 124 y obtiene JSON real del API de ONPE.
   */
  private async fetchViaPython(): Promise<OnpeCandidato[]> {
    // El script Python vive en src/resultados/ pero se busca desde el root del proceso
    const script = join(process.cwd(), 'src', 'resultados', 'onpe-fetcher.py');
    const python = process.env.PYTHON_BIN ?? 'python';
    const { stdout } = await execAsync(`"${python}" "${script}"`, { timeout: 25_000 });
    const json: { data: OnpeCandidato[] } = JSON.parse(stdout.trim());
    return json.data ?? [];
  }

  private buildResponse(of: {
    keiko_votos: number; keiko_pct: number;
    sanchez_votos: number; sanchez_pct: number;
  }): ResultadosResponseDto {
    const keiko_e   = CACHE_JEE.keiko_jee;
    const sanchez_e = CACHE_JEE.sanchez_jee;
    const total_ce  = of.keiko_votos + of.sanchez_votos + keiko_e + sanchez_e;
    const kei_ce    = total_ce > 0 ? +((of.keiko_votos + keiko_e) / total_ce * 100).toFixed(4) : 0;
    const san_ce    = +(100 - kei_ce).toFixed(4);

    const total_c    = of.keiko_votos + of.sanchez_votos;
    const pct_k      = total_c > 0 ? of.keiko_votos / total_c : 0.5;
    const votos_pend = CACHE_JEE.actas_pend * 198;

    return {
      ts:        new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
      cache_ttl: CACHE_TTL_MS / 1000,
      oficiales: {
        keiko_votos:   of.keiko_votos,
        keiko_pct:     of.keiko_pct,
        sanchez_votos: of.sanchez_votos,
        sanchez_pct:   of.sanchez_pct,
        diff:          of.keiko_votos - of.sanchez_votos,
      },
      jee: { ...CACHE_JEE },
      proyeccion: {
        keiko_votos:   of.keiko_votos + keiko_e,
        keiko_pct:     kei_ce,
        sanchez_votos: of.sanchez_votos + sanchez_e,
        sanchez_pct:   san_ce,
        diff:          (of.keiko_votos + keiko_e) - (of.sanchez_votos + sanchez_e),
      },
      pendientes: {
        actas:       CACHE_JEE.actas_pend,
        votos_est:   votos_pend,
        keiko_est:   Math.round(votos_pend * pct_k),
        sanchez_est: Math.round(votos_pend * (1 - pct_k)),
      },
    };
  }
}
