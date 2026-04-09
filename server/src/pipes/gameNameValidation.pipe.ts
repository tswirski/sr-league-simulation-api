import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameNameValidationPipe implements PipeTransform {
  transform(value: string) {
    const nameRegEx = /^[A-Za-z0-9\s]{8,30}$/

    if(typeof value !== 'string' || !nameRegEx.test(value)) {
        throw new WsException('Validation failed');
    }
    return value;
  }
}