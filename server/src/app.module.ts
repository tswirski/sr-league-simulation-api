import { Module } from '@nestjs/common';
import { SocketGateway } from './websocket/SocketGateway';
import { SimulationProvider } from './providers/SimulationProvider/SimulationProvider';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway, SimulationProvider],
})
export class AppModule {}
