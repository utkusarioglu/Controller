import "@utkusarioglu/starel-globals";
import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
import { t_scope, t_singleScope, t_waitSet, t_transmission, e_ServiceGroup, t_staticContentArchive, t_localControllerStack, t_epoch } from "./t_controller";
import { t_namespace } from "@utkusarioglu/namespace";
export { M_Controller } from "./m_controller";
export { M_ControllerEvents } from "./m_controller_events";
export { t_transmission } from "./t_controller";
export declare class Controller {
    private static _global_controller;
    private static _local_controllers;
    private static _global_namespaces;
    private _controller_global_namespace;
    private _controller_local_namespace;
    private static _static_content_archive;
    private static _static_responders;
    private static _forced_dynamic_service;
    constructor(namespace: t_namespace);
    request(scope: t_singleScope, responding_namespace: t_namespace, talk: t_resolutionInstruction, group?: e_ServiceGroup): Promise<t_transmission>;
    private request_DynamicTransmission;
    respond(scope: t_scope, response_func: (t_transmission: t_transmission) => Promise<any>, is_static?: boolean, group?: e_ServiceGroup): void;
    get_DialogueArchive(scope: t_singleScope): object;
    get_ServedChannels(scope: t_singleScope): (string | symbol)[];
    private static set_PromisifiedStaticContent;
    static get_AllStaticChannels(): t_namespace[];
    static get_AllStaticContent(): t_staticContentArchive;
    static flush_StaticContentArchive(): void;
    static force_AllDynamicService(): void;
    announce(scope: t_scope, recipient_namespace: t_namespace, talk: t_resolutionInstruction, delay?: boolean | t_epoch): void;
    private static is_StaticResponder;
    get_AnnouncementArchive(scope: t_singleScope): object[];
    subscribe(scope: t_scope, subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: t_transmission) => void): void;
    wait(scope: t_singleScope, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback?: (transmission: t_transmission) => boolean, action_callback?: (transmission: t_transmission) => void, count?: number, current_count?: number): Promise<any>;
    wait_Some(scope: t_singleScope, wait_set: t_waitSet[]): Promise<any>;
    set_LocalNamespace(local_namespace: t_namespace): this;
    get_LocalNamespace(): t_namespace;
    get_LocalNamespaces(): t_namespace[];
    set_GlobalNamespace(global_namespace: t_namespace): this;
    get_GlobalNamespace(): t_namespace;
    get_GlobalNamespaces(): t_namespace[];
    private create_LocalNamespace;
    private destroy_LocalNamespace;
    private get_Scopes;
    static get_LocalControllerStack(): t_localControllerStack;
}
