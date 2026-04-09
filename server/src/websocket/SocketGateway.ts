import { 
    WebSocketGateway, 
    MessageBody, 
    Ack, 
    SubscribeMessage, 
    WebSocketServer, 
    WsException, 
    ConnectedSocket 
} from "@nestjs/websockets";
import { UseGuards } from '@nestjs/common';
import { SimulationProvider } from "src/providers/SimulationProvider/SimulationProvider";
import { FrequencyGuard } from "src/guards/frequency.guard";
import { GameNameValidationPipe } from "src/pipes/gameNameValidation.pipe";
import { Country, type Game, type League } from 'src/providers/SimulationProvider/Simulation.types';
import { Server, Socket } from 'socket.io';



@WebSocketGateway(8080, {cors: true})
export class SocketGateway {
    protected ongoingLeague: League | null;

    constructor(protected simulation: SimulationProvider){
        this.ongoingLeague = null;
    }

    @WebSocketServer() private server: Server;

    protected transmitScore(name: string, game: Game) {
        this.server.to(name).emit('score', JSON.stringify(game));
    }

    protected transmitSummary(name: string, games: Game[]) {
        this.server.to(name).emit('summary', JSON.stringify(games));
    }

    @UseGuards(FrequencyGuard)
    @SubscribeMessage('start')
    handleStart(
        @ConnectedSocket() client: Socket,
        @MessageBody('name', new GameNameValidationPipe()) name: string,
        @Ack() ack: (response: { status: string, data: any }) => void,
    ) {
        if(this.ongoingLeague){
            this.ongoingLeague.abortController.abort();    
        }

        client.join(name);

        const abortController = new AbortController();
        this.ongoingLeague = {
            name,
            simulation: this.simulation.createSimulation(
                abortController.signal,
                (game: Game) => {
                    this.transmitScore(name, game);
                },
                (games: Game[]) => {
                    this.transmitSummary(name, games);
                    /** Remove all socket subscriptions if watched league has ended */
                    this.server.in(name).socketsLeave(name);
                },
                [
                    {host: Country.DE, guest: Country.PL, score: { host:0, guest:0 }},
                    {host: Country.BR, guest: Country.MX, score: { host:0, guest:0 }},
                    {host: Country.AR, guest: Country.UY, score: { host:0, guest:0 }},
                ]
            ),
            abortController
        };

        ack?.({status: 'OK', data: name});
        /** Notify all listening sockets about the games when the league starts */
        this.transmitSummary(name, this.ongoingLeague.simulation.getGames());
        this.ongoingLeague.simulation.startSimulation();
    }

    @SubscribeMessage('stop')
    handleStop(
        @MessageBody('name', new GameNameValidationPipe()) name: string,
        @Ack() ack: (response: { status: string, data: any }) => void,
    ) {
        if(!this.ongoingLeague || this.ongoingLeague.name !== name) {
            throw new WsException('not an noging league');
        }

        this.ongoingLeague.abortController.abort();
        ack?.({status: 'OK', data: name});
    }

    @SubscribeMessage('subscribe')
    handleWatch(
        @ConnectedSocket() client: Socket,
        @MessageBody('name', new GameNameValidationPipe()) name: string,
        @Ack() ack: (response: { status: string, data: any }) => void,
    ) {
        /** If we subscribe to a league that is already in progress, we need to update client with current games state */
        if(this.ongoingLeague && this.ongoingLeague.name === name) {
            this.transmitSummary(name, this.ongoingLeague.simulation.getGames());
        }


        client.join(name);
        ack?.({status: 'OK', data: name});
    }

    @SubscribeMessage('unsubscribe')
    handleSkip(
        @ConnectedSocket() client: Socket,
        @MessageBody('name', new GameNameValidationPipe()) name: string,
        @Ack() ack: (response: { status: string, data: any }) => void,
    ) {
        client.leave(name);
        ack?.({status: 'OK', data: name});
    }
}
