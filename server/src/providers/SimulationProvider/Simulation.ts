import type { SimulationConfig, Game, OnGameChange, OnLeagueEnd } from './Simulation.types';

/**
 * Lets say this is a simulation of a football game. In that case this would be a series of some random events
 * which in that case are passing the ball between players of two teams. Each action contains a factor of time
 * (how long player had the ball), distance (how far he kicked the ball) and team (which team had the ball).
 * We assume that team that played better, scored.
 */

const defaultConfig =  {simulationTime: 9000, scoreTime: 1000};
export class Simulation {
    protected games: Game[];

    public getGames() {
        return JSON.parse(JSON.stringify(this.games));
    }

    constructor(
        protected abortSignal: AbortSignal,
        protected onGameChange: OnGameChange,
        protected onLeagueEnd: OnLeagueEnd,
        initialGames: Game[],
        protected config: SimulationConfig = defaultConfig
    ) {
        this.games = JSON.parse(JSON.stringify(initialGames));
    }

    private getRandomGame(): Game {
        const factor = Math.floor(Math.random() * 100);
        const steps = Math.ceil(100 / this.games.length);
        return this.games[Math.ceil(factor/steps) - 1];
    }

    private passSimulation(): Promise<number> {
        return new Promise((resolve, reject) => { 
            let timeLeft = this.config.scoreTime;
            let score = 0;

            const action = () => {
                const passTime = Math.min(Math.ceil(Math.random() * 100), timeLeft);
                if(passTime <= 0) {
                    if(this.abortSignal.aborted){
                        reject();
                    }
                    return resolve(score);
                }

                timeLeft -= passTime;
                setTimeout(() => {
                    const distance = Math.random();
                    const whichTeam = Math.ceil(Math.random() * 100) % 2 === 0 ? -1 : 1;
                    score += distance * whichTeam;
                    action();
                }, passTime);
            }

            action();
        });
    }

    public startSimulation() {
        let actionsLeft = Math.ceil(this.config.simulationTime / this.config.scoreTime);

        const afoot = async () => {
            if(this.abortSignal.aborted || !actionsLeft){
                this.onLeagueEnd(this.games);
                return;
            }
            actionsLeft -= 1;
            
            const game = this.getRandomGame();

            try {
                const score = await this.passSimulation();
                game.score[score <= 0 ? 'host' : 'guest'] += 1;
        
                this.onGameChange(game);
                afoot();
            } catch(e) {
                /** Game Simulation stopped */
                this.onLeagueEnd(this.games);
            }
        }

        afoot();
    }
}