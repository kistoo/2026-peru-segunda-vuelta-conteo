import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

@Module({
  imports: [HttpModule],
  controllers: [ResultadosController],
  providers: [ResultadosService],
})
export class ResultadosModule {}
