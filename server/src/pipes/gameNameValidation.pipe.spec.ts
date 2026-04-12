import { WsException } from '@nestjs/websockets';
import { GameNameValidationPipe } from './gameNameValidation.pipe';
import { zip } from 'rxjs';

describe('FrequencyGuard', () => {
    let gameNameValidationPipe: GameNameValidationPipe;
    let validationError: WsException | null = null;

    beforeEach(() => {
        gameNameValidationPipe = new GameNameValidationPipe();
        validationError = null;
    });

    it('shoud not allow name shorter than 8 signs', () => {
        try {
            gameNameValidationPipe.transform('test');
        } catch (e) {
            validationError = e as WsException;
        }

        expect(validationError).toBeInstanceOf(WsException);
        expect(validationError?.message).toEqual('Validation failed');
    });

    it('shoud allow name that is atleast 8 signs', () => {
        const name =  gameNameValidationPipe.transform('testtest');
    
        expect(name).toEqual('testtest');
    });

    it('shoud not allow name longer than 30 signs', () => {
        try {
            gameNameValidationPipe.transform('t'.repeat(31));
        } catch (e) {
            validationError = e as WsException;
        }

        expect(validationError).toBeInstanceOf(WsException);
        expect(validationError?.message).toEqual('Validation failed');
    });

    it('shoud allow name that is 30 signs', () => {
        const name =  gameNameValidationPipe.transform('t'.repeat(30));
    
        expect(name).toEqual('t'.repeat(30));
    });


    it('shoud allow name that contains UperCase letters, lowerCase letters, numbers and spaces', () => {
        const name =  gameNameValidationPipe.transform('tHiS iS TeSt 001');
    
        expect(name).toEqual('tHiS iS TeSt 001');
    });

    
    it('shoud not allow special chacarters', () => {
        try {
            gameNameValidationPipe.transform('t#st&!@#$% 123');
        } catch (e) {
            validationError = e as WsException;
        }

        expect(validationError).toBeInstanceOf(WsException);
        expect(validationError?.message).toEqual('Validation failed');
    });
})