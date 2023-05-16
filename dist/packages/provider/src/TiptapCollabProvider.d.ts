import { HocuspocusProvider, HocuspocusProviderConfiguration } from './HocuspocusProvider';
export type TiptapCollabProviderConfiguration = Required<Pick<HocuspocusProviderConfiguration, 'name'>> & Partial<HocuspocusProviderConfiguration> & AdditionalTiptapCollabProviderConfiguration;
export interface AdditionalTiptapCollabProviderConfiguration {
    /**
     * A Hocuspocus Cloud App ID, get one here: https://collab.tiptap.dev
     */
    appId: string;
}
export declare class TiptapCollabProvider extends HocuspocusProvider {
    constructor(configuration: TiptapCollabProviderConfiguration);
}
