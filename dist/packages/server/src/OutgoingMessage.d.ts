import { Encoder } from 'lib0/encoding';
import { Awareness } from 'y-protocols/awareness';
import Document from './Document';
export declare class OutgoingMessage {
    encoder: Encoder;
    type?: number;
    category?: string;
    constructor(documentName: string);
    createSyncMessage(): OutgoingMessage;
    createSyncReplyMessage(): OutgoingMessage;
    createAwarenessUpdateMessage(awareness: Awareness, changedClients?: Array<any>): OutgoingMessage;
    writeQueryAwareness(): OutgoingMessage;
    writeAuthenticated(): OutgoingMessage;
    writePermissionDenied(reason: string): OutgoingMessage;
    writeFirstSyncStepFor(document: Document): OutgoingMessage;
    writeUpdate(update: Uint8Array): OutgoingMessage;
    writeStateless(payload: string): OutgoingMessage;
    writeBroadcastStateless(payload: string): OutgoingMessage;
    toUint8Array(): Uint8Array;
}
