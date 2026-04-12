import { Simulation } from './Simulation';
import { Country } from './Simulation.types';

const initialGames = [
    {host: Country.DE, guest: Country.PL, score: { host:0, guest:0 }},
    {host: Country.BR, guest: Country.MX, score: { host:0, guest:0 }},
    {host: Country.AR, guest: Country.UY, score: { host:0, guest:0 }},
];

describe('Simulation', () => {
    let simulation: Simulation;
    let abortController: AbortController;
    const onGameChangeSpy = jest.fn();
    const onLeagueEndSpy = jest.fn(); 

    beforeEach(() => {
        abortController = new AbortController();
        onGameChangeSpy.mockClear();
        onLeagueEndSpy.mockClear();

        simulation = new Simulation(
            abortController.signal, 
            onGameChangeSpy,
            onLeagueEndSpy,
            [
                {host: Country.DE, guest: Country.PL, score: { host:0, guest:0 }},
                {host: Country.BR, guest: Country.MX, score: { host:0, guest:0 }},
                {host: Country.AR, guest: Country.UY, score: { host:0, guest:0 }},
            ]
        );
    });

    it('should return current games (initial games, simulation not yet started)', () => {
      expect(simulation.getGames()).toEqual(initialGames);
    });

    it('should run simulation', async () => {
        jest.useFakeTimers();
        simulation.startSimulation();
        await jest.runAllTimersAsync();
        expect(onGameChangeSpy).toHaveBeenCalledTimes(9);
        expect(onLeagueEndSpy).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });
});