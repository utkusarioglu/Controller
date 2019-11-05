// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../@utkusarioglu/resolver

declare module '@utkusarioglu/controller' {
    import "@utkusarioglu/object-assist";
    import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
    import { t_scope, t_singleScope, t_waitSet, t_transmission, e_ServiceGroup, t_staticContentArchive, t_localControllerStack, t_epoch, t_namespace } from "@utkusarioglu/controller/t_controller";
    export class Controller {
        constructor(namespace: t_namespace);
        request(scope: t_singleScope, responding_namespace: t_namespace, talk: t_resolutionInstruction, group?: e_ServiceGroup): Promise<t_transmission>;
        respond(scope: t_scope, response_func: (t_transmission: t_transmission) => Promise<any>, is_static?: boolean, group?: e_ServiceGroup): void;
        get_DialogueArchive(scope: t_singleScope): object;
        get_ServedChannels(scope: t_singleScope): (string | symbol)[];
        static get_AllStaticChannels(): t_namespace[];
        static get_AllStaticContent(): t_staticContentArchive;
        static flush_StaticContentArchive(): void;
        static force_AllDynamicService(): void;
        announce(scope: t_scope, recipient_namespace: t_namespace, talk: t_resolutionInstruction, delay?: boolean | t_epoch): void;
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
        static get_LocalControllerStack(): t_localControllerStack;
    }
}

declare module '@utkusarioglu/controller/t_controller' {
    import { t_resolutionInstructionNoArgs, t_resolutionInstruction } from "@utkusarioglu/resolver";
    import { BaseController } from "@utkusarioglu/controller/base_controller";
    export type t_epoch = number;
    export type t_namespace = string;
    export enum e_Scope {
        Local = 1,
        Global = 10,
        LocalAndGlobal = 11
    }
    export type t_scope = e_Scope;
    export type t_singleScope = e_Scope.Local | e_Scope.Global;
    export type t_error = {};
    export type t_channel = string;
    export type t_serviceId = string;
    export type t_waitSet = {
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Test?: (transmission: t_transmission) => boolean;
        Call?: (transmission: t_transmission) => any;
    };
    export type t_transmissionContent = any;
    export type t_transmission = {
        Sender: t_namespace;
        Recipient: t_namespace;
        Channel?: t_channel;
        Group?: e_ServiceGroup;
        Listen?: t_resolutionInstructionNoArgs;
        Talk?: t_resolutionInstruction;
        Content?: t_transmissionContent;
        Error?: t_error;
        Id?: t_serviceId;
        Time: t_epoch;
        Static: boolean;
        LastDynamicTime?: t_epoch;
        Scope: e_Scope;
    };
    export type t_dependency_group = {
        Scope: t_singleScope;
        Members: t_waitSet[];
        Call: (value: any) => Promise<any>;
    };
    export type t_subscription = {
        Scope: t_scope;
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
    };
    export type t_service = {
        Scope: t_scope;
        Namespace: t_namespace;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
        Static?: boolean;
        Group: e_ServiceGroup;
    };
    export type t_reception = {
        Scope: t_scope;
        Namespace?: t_namespace;
        Talk: t_resolutionInstruction;
        Listen: t_resolutionInstructionNoArgs;
        Call: (value: any) => any;
    };
    export type t_announcement = {
        Scope: t_scope;
        Namespace: t_namespace;
        Talk: any;
    };
    export enum e_ServiceGroup {
        Standard = 0
    }
    export type t_staticContentArchive = {
        [channel: string]: {
            [unique_request_code: string]: t_transmission;
        };
    };
    export type t_localControllerStack = {
        [namespace: string]: BaseController;
    };
    export type t_sequenceStep = {
        StartMessage?: string;
        EndMessage?: string;
        Listen: t_resolutionInstructionNoArgs;
        List: t_namespace[];
        Talk?: t_resolutionInstructionNoArgs;
    };
    export type t_controllerGenericObj = {
        [key: string]: any;
    };
}

declare module '@utkusarioglu/controller/base_controller' {
    import "@utkusarioglu/object-assist";
    import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
    import { t_serviceId, t_waitSet, t_transmission, e_ServiceGroup, e_Scope, t_singleScope, t_namespace, t_epoch } from "@utkusarioglu/controller/t_controller";
    export class BaseController {
        constructor(controller_scope: t_singleScope);
        request(scope: e_Scope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, group: e_ServiceGroup): Promise<any>;
        respond(responder_namespace: t_namespace, response_callback: (transmission: t_transmission) => Promise<any>, group: e_ServiceGroup, scope: e_Scope): void;
        static create_RandomServiceId(): t_serviceId;
        get_DialogueArchive(): object[];
        get_ServedChannels(): (string | symbol)[];
        announce(scope: t_singleScope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, delay?: boolean | t_epoch): void;
        get_AnnouncementArchive(): object[];
        subscribe(scope: t_singleScope, subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: t_transmission) => void): void;
        wait(scope: t_singleScope, sender_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback?: (transmission: t_transmission) => boolean, action_callback?: (transmission: t_transmission) => void, total_count?: number, current_count?: number): Promise<any>;
        wait_Some(scope: t_singleScope, sender_namespace: t_namespace, wait_set: t_waitSet[]): Promise<t_transmission[]>;
    }
}

