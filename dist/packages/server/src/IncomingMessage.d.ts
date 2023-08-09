import { Decoder } from 'lib0/decoding';
import { Encoder } from 'lib0/encoding';
import { MessageType } from './types.js';
export declare class IncomingMessage {
    /**
     * Access to the received message.
     */
    decoder: Decoder;
    /**
     * Access to the reply.
     */
    encoder: Encoder;
    constructor(input: any);
    readVarUint8Array(): Uint8Array;
    readVarUint(): number;
    readVarString(): string;
    toUint8Array(): Uint8Array;
    writeVarUint(type: MessageType): void;
    writeVarString(string: string): void;
    get length(): number;
}
