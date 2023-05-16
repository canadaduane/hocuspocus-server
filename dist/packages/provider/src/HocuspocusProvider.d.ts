import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import * as mutex from 'lib0/mutex';
import type { CloseEvent, Event, MessageEvent } from 'ws';
import EventEmitter from './EventEmitter';
import { ConstructableOutgoingMessage, onAuthenticationFailedParameters, onCloseParameters, onDisconnectParameters, onMessageParameters, onOpenParameters, onOutgoingMessageParameters, onStatelessParameters, onStatusParameters, onSyncedParameters, WebSocketStatus } from './types';
import { CompleteHocuspocusProviderWebsocketConfiguration, HocuspocusProviderWebsocket } from './HocuspocusProviderWebsocket';
import { onAwarenessChangeParameters, onAwarenessUpdateParameters } from '.';
export type HocuspocusProviderConfiguration = Required<Pick<CompleteHocuspocusProviderConfiguration, 'name'>> & Partial<CompleteHocuspocusProviderConfiguration> & (Required<Pick<CompleteHocuspocusProviderWebsocketConfiguration, 'url'>> | Required<Pick<CompleteHocuspocusProviderConfiguration, 'websocketProvider'>>);
export interface CompleteHocuspocusProviderConfiguration {
    /**
     * The identifier/name of your document
     */
    name: string;
    /**
     * The actual Y.js document
     */
    document: Y.Doc;
    /**
     * Pass false to disable broadcasting between browser tabs.
     */
    broadcast: boolean;
    /**
     * An Awareness instance to keep the presence state of all clients.
     */
    awareness: Awareness;
    /**
     * A token that’s sent to the backend for authentication purposes.
     */
    token: string | (() => string) | (() => Promise<string>) | null;
    /**
     * URL parameters that should be added.
     */
    parameters: {
        [key: string]: any;
    };
    /**
     * Hocuspocus websocket provider
     */
    websocketProvider: HocuspocusProviderWebsocket;
    /**
     * Force syncing the document in the defined interval.
     */
    forceSyncInterval: false | number;
    onAuthenticated: () => void;
    onAuthenticationFailed: (data: onAuthenticationFailedParameters) => void;
    onOpen: (data: onOpenParameters) => void;
    onConnect: () => void;
    onMessage: (data: onMessageParameters) => void;
    onOutgoingMessage: (data: onOutgoingMessageParameters) => void;
    onStatus: (data: onStatusParameters) => void;
    onSynced: (data: onSyncedParameters) => void;
    onDisconnect: (data: onDisconnectParameters) => void;
    onClose: (data: onCloseParameters) => void;
    onDestroy: () => void;
    onAwarenessUpdate: (data: onAwarenessUpdateParameters) => void;
    onAwarenessChange: (data: onAwarenessChangeParameters) => void;
    onStateless: (data: onStatelessParameters) => void;
    /**
     * Don’t output any warnings.
     */
    quiet: boolean;
}
export declare class HocuspocusProvider extends EventEmitter {
    configuration: CompleteHocuspocusProviderConfiguration;
    subscribedToBroadcastChannel: boolean;
    isSynced: boolean;
    unsyncedChanges: number;
    status: WebSocketStatus;
    isAuthenticated: boolean;
    mux: mutex.mutex;
    intervals: any;
    isConnected: boolean;
    constructor(configuration: HocuspocusProviderConfiguration);
    onStatus({ status }: onStatusParameters): void;
    setConfiguration(configuration?: Partial<HocuspocusProviderConfiguration>): void;
    get document(): Y.Doc;
    get awareness(): Awareness;
    get hasUnsyncedChanges(): boolean;
    updateUnsyncedChanges(unsyncedChanges?: number): void;
    forceSync(): void;
    boundBeforeUnload: () => void;
    beforeUnload(): void;
    registerEventListeners(): void;
    sendStateless(payload: string): void;
    documentUpdateHandler(update: Uint8Array, origin: any): void;
    awarenessUpdateHandler({ added, updated, removed }: any, origin: any): void;
    get synced(): boolean;
    set synced(state: boolean);
    receiveStateless(payload: string): void;
    get isAuthenticationRequired(): boolean;
    connect(): Promise<unknown>;
    disconnect(): void;
    onOpen(event: Event): Promise<void>;
    getToken(): Promise<string | null>;
    startSync(): void;
    send(message: ConstructableOutgoingMessage, args: any, broadcast?: boolean): void;
    onMessage(event: MessageEvent): void;
    onClose(event: CloseEvent): void;
    destroy(): void;
    permissionDeniedHandler(reason: string): void;
    authenticatedHandler(): void;
    get broadcastChannel(): string;
    boundBroadcastChannelSubscriber: (data: ArrayBuffer) => void;
    broadcastChannelSubscriber(data: ArrayBuffer): void;
    subscribeToBroadcastChannel(): void;
    disconnectBroadcastChannel(): void;
    broadcast(Message: ConstructableOutgoingMessage, args?: any): void;
    setAwarenessField(key: string, value: any): void;
}
