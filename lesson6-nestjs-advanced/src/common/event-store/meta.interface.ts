import { UUID } from "../basic-types";
import { DomainEvent } from "../domain-event";

export interface Meta {
    Event: DomainEvent;
    Type: string;
    StreamId: UUID
}