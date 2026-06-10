import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResultadosModule } from './resultados/resultados.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ResultadosModule,
  ],
})
export class AppModule {}
