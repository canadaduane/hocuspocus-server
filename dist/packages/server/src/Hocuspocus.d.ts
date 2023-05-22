/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage, Server as HTTPServer } from 'http';
import WebSocket, { AddressInfo, WebSocketServer } from 'ws';
import { Configuration, HookName, HookPayload, onListenPayload } from './types';
import Document from './Document';
import { Debugger } from './Debugger';
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
    handleConnection(incoming: WebSocket, request: IncomingMessage, context?: any): void;
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
    private createDocument;
    /**
     * Create a new connection by the given request and document
     */
    private createConnection;
    /**
     * Run the given hook on all configured extensions.
     * Runs the given callback after each hook.
     */
    hooks(name: HookName, payload: HookPayload, callback?: Function | null): Promise<any>;
    /**
     * Get parameters by the given request
     */
    private static getParameters;
    enableDebugging(): void;
    enableMessageLogging(): void;
    disableLogging(): void;
    disableDebugging(): void;
    flushMessageLogs(): this;
    getMessageLogs(): any[];
}
export declare const Server: Hocuspocus;
