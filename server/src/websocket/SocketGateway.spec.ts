import { Test } from '@nestjs/testing';
import { SocketGateway } from './SocketGateway';
import { SimulationProvider } from '../providers/SimulationProvider/SimulationProvider';

jest.mock('../providers/SimulationProvider/SimulationProvider');

describe('SocketGateway', () => {
  let socketGateway: SocketGateway;

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

  describe('findAll', () => {
    it('should do something', async () => {
      expect(true).toBe(true);
    });
  });
});