import { Injectable } from '@nestjs/common';
import { Simulation } from './Simulation';
import { OnGameChange, OnLeagueEnd, SimulationConfig, Game } from './Simulation.types';

@Injectable()
export class SimulationProvider {
    public createSimulation(
        abortSignal: AbortSignal,
        onGameChange: OnGameChange,
        onLeagueEnd: OnLeagueEnd,
        initialGames: Game[], 
        config?: SimulationConfig
    ) {
        return new Simulation(abortSignal, onGameChange, onLeagueEnd, initialGames, config);
    }
}