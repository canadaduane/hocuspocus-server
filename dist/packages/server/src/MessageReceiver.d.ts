import Connection from './Connection';
import { IncomingMessage } from './IncomingMessage';
import { Debugger } from './Debugger';
import Document from './Document';
export declare class MessageReceiver {
    message: IncomingMessage;
    logger: Debugger;
    constructor(message: IncomingMessage, logger: Debugger);
    apply(document: Document, connection?: Connection, reply?: (message: Uint8Array) => void): void;
    readSyncMessage(message: IncomingMessage, document: Document, connection?: Connection, reply?: (message: Uint8Array) => void, requestFirstSync?: boolean): 0 | 1 | 2;
    applyQueryAwarenessMessage(document: Document, reply?: (message: Uint8Array) => void): void;
}
