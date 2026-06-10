import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ResultadosService } from './resultados.service';
import type { ResultadosResponseDto } from './dto/resultados.dto';

@Controller('resultados')
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getResultados(): Promise<ResultadosResponseDto> {
    return this.resultadosService.getResultados();
  }
}
