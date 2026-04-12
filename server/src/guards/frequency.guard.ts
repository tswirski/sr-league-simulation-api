import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class FrequencyGuard implements CanActivate {
  protected requestTimestamp: number | null = null;

  canActivate(): boolean {
    const currentTimestamp = Date.now();

    if(this.requestTimestamp && (currentTimestamp - this.requestTimestamp) < 5000){
        const guardTime = 5000 - (currentTimestamp - this.requestTimestamp);

        throw new WsException(`Can not start another league for next ${guardTime} ms`);
    }
    this.requestTimestamp = currentTimestamp;  
    return true;
  }
}