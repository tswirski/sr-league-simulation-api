import { Test } from '@nestjs/testing';
import { SocketGateway } from './SocketGateway';
import { SimulationProvider } from '../providers/SimulationProvider/SimulationProvider';
import ioc from 'socket.io-client';
import { Socket } from 'socket.io-client';

jest.mock('../providers/SimulationProvider/SimulationProvider');

describe('SocketGateway', () => {
  let socketGateway: SocketGateway;
  let clientSocket: Socket;

  beforeEach(async () => {
    jest.mocked(SimulationProvider).mockReturnValue({
        createSimulation: jest.fn(),
    });

    const moduleRef = await Test.createTestingModule({
        controllers: [],
        providers: [SocketGateway, SimulationProvider],
      }).compile();

    socketGateway = moduleRef.get(SocketGateway);
  });

  /** While my idea was to spawn multiple clients and test Gateway using real connections, 
   * it seems that either WS Server is not starting within Jest or there is issue with client 
   * (however that approach follows testing guide of socket.io doc). Either way, I leave this test as it is 
   * just to leave trace of being here ;) 
   * Unfortunately due to work and family the time I can spend on that recrutation task is limited thus
   * no tests for the Gateway. 
   * */

  it('should connect to server', async () => {
    clientSocket = ioc(`ws://localhost:8080`);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    expect(clientSocket.connected).toBeTruthy();
  });
});