/// <reference types="node" />
/// <reference types="node" />
import { Server as HTTPServer, IncomingMessage } from 'http';
import WebSocket, { AddressInfo, WebSocketServer } from 'ws';
import { Debugger } from './Debugger.js';
import { DirectConnection } from './DirectConnection.js';
import Document from './Document.js';
import { Configuration, ConnectionConfiguration, HookName, HookPayloadByName, onListenPayload, onStoreDocumentPayload } from './types.js';
export declare const defaultConfiguration: {
    name: null;
    port: number;
    address: string;
    timeout: number;
    debounce: number;
    maxDebounce: number;
    quiet: boolean;
    yDocOptions: {
        gc: boolean;
        gcFilter: () => boolean;
    };
};
/**
 * Hocuspocus Server
 */
export declare class Hocuspocus {
    configuration: Configuration;
    documents: Map<string, Document>;
    httpServer?: HTTPServer;
    webSocketServer?: WebSocketServer;
    debugger: Debugger;
    constructor(configuration?: Partial<Configuration>);
    /**
     * Configure the server
     */
    configure(configuration: Partial<Configuration>): Hocuspocus;
    get requiresAuthentication(): boolean;
    /**
     * Start the server
     */
    listen(portOrCallback?: number | ((data: onListenPayload) => Promise<any>) | null, callback?: any): Promise<Hocuspocus>;
    get address(): AddressInfo;
    get URL(): string;
    get webSocketURL(): string;
    get httpURL(): string;
    private showStartScreen;
    /**
     * Get the total number of active documents
     */
    getDocumentsCount(): number;
    /**
     * Get the total number of active connections
     */
    getConnectionsCount(): number;
    /**
     * Force close one or more connections
     */
    closeConnections(documentName?: string): void;
    /**
     * Destroy the server
     */
    destroy(): Promise<any>;
    /**
     * The `handleConnection` method receives incoming WebSocket connections,
     * runs all hooks:
     *
     *  - onConnect for all connections
     *  - onAuthenticate only if required
     *
     * … and if nothings fails it’ll fully establish the connection and
     * load the Document then.
     */
    handleConnection(incoming: WebSocket, request: IncomingMessage, defaultContext?: any): void;
    /**
     * Handle update of the given document
     */
    private handleDocumentUpdate;
    timers: Map<string, {
        timeout: NodeJS.Timeout;
        start: number;
    }>;
    /**
     * debounce the given function, using the given identifier
     */
    debounce(id: string, func: Function, immediately?: boolean): void;
    /**
     * Create a new document by the given request
     */
    createDocument(documentName: string, request: Partial<Pick<IncomingMessage, 'headers' | 'url'>>, socketId: string, connection: ConnectionConfiguration, context?: any): Promise<Document>;
    storeDocumentHooks(document: Document, hookPayload: onStoreDocumentPayload): void;
    /**
     * Run the given hook on all configured extensions.
     * Runs the given callback after each hook.
     */
    hooks<T extends HookName>(name: T, payload: HookPayloadByName[T], callback?: Function | null): Promise<any>;
    unloadDocument(document: Document): void;
    enableDebugging(): void;
    enableMessageLogging(): void;
    disableLogging(): void;
    disableDebugging(): void;
    flushMessageLogs(): this;
    getMessageLogs(): any[];
    openDirectConnection(documentName: string, context?: any): Promise<DirectConnection>;
}
export declare const Server: Hocuspocus;
