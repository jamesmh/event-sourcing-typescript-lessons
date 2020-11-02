import { v4 as createUuid } from 'uuid';
import { TimeStamp, UUID } from './basic-types';

export class DomainEvent {
    static TypeName: string = 'DomainEvent';
    EventId: UUID;
    At: TimeStamp;

    constructor() {
        this.EventId = createUuid();
        this.At = new Date().getTime();
    }
}