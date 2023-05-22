import Document from './Document';
import type { Hocuspocus } from './Hocuspocus';
export declare class DirectConnection {
    document: Document | null;
    instance: Hocuspocus;
    context: any;
    /**
     * Constructor.
     */
    constructor(document: Document, instance: Hocuspocus, context?: any);
    transact(transaction: (document: Document) => void): Promise<void>;
    disconnect(): void;
}
