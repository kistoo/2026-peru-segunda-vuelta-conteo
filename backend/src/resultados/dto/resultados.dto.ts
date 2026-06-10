export class CandidatoOficialDto {
  keiko_votos!: number;
  keiko_pct!: number;
  sanchez_votos!: number;
  sanchez_pct!: number;
  diff!: number;
}

export class JeeDataDto {
  actas_jee!: number;
  actas_pend!: number;
  keiko_jee!: number;
  sanchez_jee!: number;
  nulos_jee!: number;
  blancos_jee!: number;
  impug_jee!: number;
  fuente!: string;
}

export class ProyeccionDto {
  keiko_votos!: number;
  keiko_pct!: number;
  sanchez_votos!: number;
  sanchez_pct!: number;
  diff!: number;
}

export class PendientesDto {
  actas!: number;
  votos_est!: number;
  keiko_est!: number;
  sanchez_est!: number;
}

export class ResultadosResponseDto {
  ts!: string;
  cache_ttl!: number;
  oficiales!: CandidatoOficialDto;
  jee!: JeeDataDto;
  proyeccion!: ProyeccionDto;
  pendientes!: PendientesDto;
}
