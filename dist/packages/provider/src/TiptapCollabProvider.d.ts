import type { AbstractType, YArrayEvent } from 'yjs';
import { HocuspocusProvider, HocuspocusProviderConfiguration } from './HocuspocusProvider.js';
import { TiptapCollabProviderWebsocket } from './TiptapCollabProviderWebsocket.js';
export type TiptapCollabProviderConfiguration = Required<Pick<HocuspocusProviderConfiguration, 'name'>> & Partial<HocuspocusProviderConfiguration> & (Required<Pick<AdditionalTiptapCollabProviderConfiguration, 'websocketProvider'>> | Required<Pick<AdditionalTiptapCollabProviderConfiguration, 'appId'>>);
export interface AdditionalTiptapCollabProviderConfiguration {
    /**
     * A Hocuspocus Cloud App ID, get one here: https://collab.tiptap.dev
     */
    appId?: string;
    websocketProvider?: TiptapCollabProviderWebsocket;
}
export type AuditHistoryVersion = {
    name?: string;
    version: number;
    date: number;
};
export declare class TiptapCollabProvider extends HocuspocusProvider {
    tiptapCollabConfigurationPrefix: string;
    constructor(configuration: TiptapCollabProviderConfiguration);
    createVersion(name?: string): void;
    revertToVersion(targetVersion: number): void;
    getVersions(): AuditHistoryVersion[];
    watchVersions(callback: Parameters<AbstractType<YArrayEvent<AuditHistoryVersion>>['observe']>[0]): void;
    unwatchVersions(callback: Parameters<AbstractType<YArrayEvent<AuditHistoryVersion>>['unobserve']>[0]): void;
    isAutoVersioning(): boolean;
    enableAutoVersioning(): 1;
    disableAutoVersioning(): 0;
}
