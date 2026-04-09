export enum Country {
    DE = 'Germany',
    PL = 'Poland',
    AR = 'Argentina' , 
    MX = 'Mexico',
    UY = 'Uruguay',
    BR = 'Brazil',
};

type Simulation = {
    getGames(): Game[],
    startSimulation(): void,
};

export type League = {
    name: string;
    simulation: Simulation;
    abortController: AbortController
};

export type Score = {
    host: number;
    guest: number;
}

export type Game = {
    host: Country;
    guest: Country;
    score: Score;
}

export type SimulationConfig = {
    simulationTime: number;
    scoreTime: number;
};

export type OnGameChange = (game: Game) => void;
export type OnLeagueEnd = (games: Game[]) => void;