import { Injectable } from '@nestjs/common';
import { UUID } from '../basic-types';
import { DomainEvent } from '../domain-event';
import { Meta } from './meta.interface';

@Injectable()
export class EventStoreService {
    private _log: Meta[];

    constructor() {
        this._log = [];
    }

    append(streamId: UUID, event: DomainEvent, type: string): void {
        const meta: Meta = {StreamId: streamId, Event: event, Type: type}
        this._log.push(meta);
    }

    getAll(): Meta[] {
        return this._log;
    }

    getForStream(streamId: UUID): Meta[] {
        return this.getAll()
            .filter(meta => meta.StreamId === streamId);
    }
}
