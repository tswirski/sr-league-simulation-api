import { WsException } from '@nestjs/websockets';
import { FrequencyGuard } from './frequency.guard';

describe('FrequencyGuard', () => {
    let frequencyGuard: FrequencyGuard;
    let wsException: WsException | null = null;
 
    beforeEach(() => {
        wsException = null;
        frequencyGuard = new FrequencyGuard();
    });

    it('should instance FrequencyQuard', async () => {
      expect(frequencyGuard).toBeInstanceOf(FrequencyGuard);
    });

    it('should canActivate for first call', () => {
      expect(frequencyGuard.canActivate()).toBe(true);
    });

    it('should throw exception for if another call is within 5000ms', () => {
      frequencyGuard.canActivate();
   

      try {
        frequencyGuard.canActivate();
      } catch(e) {
        wsException = e as WsException;
      }

       expect(wsException).toBeInstanceOf(WsException);
    });

    it('should throw exception for if another call is within 5000ms (test with delay of 4999)', () => {
      jest.useFakeTimers();
      frequencyGuard.canActivate();
      
      jest.advanceTimersByTime(4999);
      try {
        frequencyGuard.canActivate();
      } catch(e) {
        wsException = e as WsException;
      }

       expect(wsException).toBeInstanceOf(WsException);
       jest.useRealTimers();
    });

    it('should allow another activation if 5000ms passes', () => {
        jest.useFakeTimers();
        frequencyGuard.canActivate();

        jest.advanceTimersByTime(5001);
        expect(frequencyGuard.canActivate()).toBe(true);
        jest.useRealTimers();
    });
});