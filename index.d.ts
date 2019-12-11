// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../@utkusarioglu/resolver
//   ../@utkusarioglu/namespace
//   ../@utkusarioglu/resolver/Common/t_resolver
//   ../@utkusarioglu/state
//   ../@utkusarioglu/state/t_state

declare module '@utkusarioglu/controller' {
    export { Controller } from "@utkusarioglu/controller/Controller/controller";
    export { M_Controller } from "@utkusarioglu/controller/Mixins/m_controller";
    export { M_ControllerEvents } from "@utkusarioglu/controller/Mixins/m_controller_events";
    export { C_Controller, C_StartupTalk, C_BootState, } from "@utkusarioglu/controller/Common/c_controller";
    export { e_Scope, i_subscription, i_sequenceStep, i_dependency_group, i_service, i_reception, t_channel, i_waitSet, i_talk, i_response, i_request, } from "@utkusarioglu/controller/Common/t_controller";
}

declare module '@utkusarioglu/controller/Controller/controller' {
    import { SeparatorHandler } from "@utkusarioglu/controller/Common/separator_handler";
    import { t_ri } from "@utkusarioglu/resolver";
    import { t_scope, t_singleScope, i_waitSet, e_ServiceGroup, i_staticContentArchive, i_localControllerStack, t_epoch, i_talk, i_response, i_EventEmitter, t_waitActionCallback, t_waitTestCallback, t_wait, t_serviceCallback } from "@utkusarioglu/controller/Common/t_controller";
    import { t_namespace } from "@utkusarioglu/namespace";
    import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";
    export class Controller extends SeparatorHandler {
        constructor(namespace: t_namespace);
        static flush_GlobalController(): void;
        static set_EventEmitter(event_emitter: any): void;
        static get_EventEmitter(): i_EventEmitter;
        get_EventEmitter(): i_EventEmitter;
        request<Content = any>(responding_namespace: t_namespace, talk: t_ri_any, scope?: t_singleScope, group?: e_ServiceGroup): Promise<i_response<Content>>;
        respond<CallRi extends t_ri_any = t_ri_any, Content = any>(response_callback: t_serviceCallback<CallRi, Content>, is_static?: boolean, scope?: t_scope, group?: e_ServiceGroup): this;
        get_DialogueArchive(scope: t_singleScope): object;
        static get_AllStaticChannels(): t_namespace[];
        static get_AllStaticContent(): i_staticContentArchive;
        static flush_StaticContentArchive(): void;
        static force_AllDynamicService(): void;
        announce<TalkRi extends t_ri_any>(recipient_namespace: t_namespace, talk: TalkRi, scope?: t_scope, delay?: boolean | t_epoch): this;
        get_AnnouncementArchive(scope: t_singleScope): object[];
        subscribe<TalkRi extends t_ri_any = t_ri_any>(listen: t_ri, callback: (transmission: i_talk<TalkRi>) => void, subcribed_namespace?: t_namespace, scope?: t_scope): this;
        wait<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>>(recipient_namespace: t_namespace, listen: t_ri, test_callback?: t_waitTestCallback<TalkRi>, action_callback?: t_waitActionCallback<TalkRi, Return>, scope?: t_singleScope, count?: number, current_count?: number): Promise<t_wait<TalkRi, Return>>;
        wait_Some<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>>(wait_set: Array<i_waitSet<TalkRi, Return>>, scope: t_singleScope): Promise<Array<t_wait<TalkRi, Return>>>;
        set_LocalNamespace(local_namespace: t_namespace): this;
        get_LocalNamespace(): t_namespace;
        get_LocalNamespaces(): t_namespace[];
        set_GlobalNamespace(global_namespace: t_namespace): this;
        get_GlobalNamespace(): t_namespace;
        static get_GlobalNamespaces(): t_namespace[];
        static get_LocalControllerStack(): i_localControllerStack;
    }
}

declare module '@utkusarioglu/controller/Mixins/m_controller' {
    import { M_Namespace } from "@utkusarioglu/namespace";
    import { Controller } from "@utkusarioglu/controller/Controller/controller";
    export interface M_Controller extends M_Namespace {
    }
    export abstract class M_Controller {
        protected set_Controller(): this;
        protected get_Controller(): Controller;
    }
}

declare module '@utkusarioglu/controller/Mixins/m_controller_events' {
    import { M_State } from "@utkusarioglu/state";
    import { M_Namespace } from "@utkusarioglu/namespace";
    import { M_Controller } from "@utkusarioglu/controller/Mixins/m_controller";
    import { i_subscription, i_reception, i_dependency_group, i_service, t_singleScope, i_sequenceStep, i_talk } from "@utkusarioglu/controller/Common/t_controller";
    import { t_ri, t_ri_any } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    import { t_epoch } from "@utkusarioglu/state/t_state";
    export interface M_ControllerEvents extends M_Controller, M_State, M_Namespace {
    }
    export abstract class M_ControllerEvents {
        include_Subscriptions<SubscriptionCallRI extends t_ri_any = t_ri_any>(subscription_list: Array<i_subscription<SubscriptionCallRI>>): this;
        include_Dependencies<TalkRi extends t_ri_any = t_ri_any, Return extends i_talk = i_talk<TalkRi>>(dependencies_list: i_dependency_group<TalkRi, Return>[]): this;
        include_Receptions<SubscriptionCallRi extends t_ri_any = t_ri_any, AnnouncementTalkRi extends t_ri_any = t_ri_any>(reception_list: i_reception<SubscriptionCallRi, AnnouncementTalkRi>[]): this;
        include_Services<CallRi extends t_ri_any = t_ri_any>(services_list: i_service<CallRi>[]): this;
        initialize_Controller(sequential_startup?: boolean): this;
        protected manage_ControllerSequence(sequence_steps: Array<i_sequenceStep>, scope: t_singleScope, manager_namespace: t_namespace): Promise<any>;
        produce_PromiseStackMember(scope: t_singleScope, manager_namespace: t_namespace, step: i_sequenceStep): Promise<t_ri>;
        produce_StepsPromise(scope: t_singleScope, manager_namespace: t_namespace, step_promise_stack: Array<Promise<any>>, step: i_sequenceStep, index: number): Promise<any>;
        protected announce_ToAllServices(resolution_instruction: t_ri, delay?: t_epoch): void;
        protected announce_LibraryAdded(library_source_namespace: t_namespace): void;
    }
}

declare module '@utkusarioglu/controller/Common/c_controller' {
    import { i_map } from "@utkusarioglu/controller/Common/t_controller";
    import { t_ri } from "@utkusarioglu/resolver";
    export const C_Controller: i_map<string>;
    export const C_BootState: i_map<t_ri>;
    export const C_StartupTalk: i_map<t_ri>;
}

declare module '@utkusarioglu/controller/Common/t_controller' {
    import { BaseController } from "@utkusarioglu/controller/BaseController/base_controller";
    import { t_ri } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";
    export type t_epoch = number;
    export enum e_Scope {
        Local = 1,
        Global = 10,
        LocalAndGlobal = 11
    }
    export type t_scope = e_Scope;
    export type t_singleScope = e_Scope.Local | e_Scope.Global;
    export interface i_error {
    }
    export type t_channel = string;
    export type t_serviceId = string;
    export interface i_waitSet<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> {
        Namespace: t_namespace;
        Listen: t_ri;
        Test?: t_waitTestCallback<TalkRi>;
        Call?: t_waitPromiseResponse<TalkRi, Return>;
    }
    export type t_transmissionContent = any;
    export interface i_dependency_group<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> {
        Scope: t_singleScope;
        Members: i_waitSet<TalkRi, Return>[];
        Call: (value: any) => Promise<any>;
    }
    export interface i_subscription<CallRi extends t_ri_any = t_ri_any> {
        Scope: t_scope;
        Namespace: t_namespace;
        Listen: t_ri;
        Call: (transmission: i_talk<CallRi>) => void;
    }
    export interface i_service<CallRi extends t_ri_any = t_ri_any, ReturnContent = any> {
        Scope: t_scope;
        Call: t_serviceCallback<CallRi, ReturnContent>;
        Static?: boolean;
        Group?: e_ServiceGroup;
    }
    export type t_serviceCallback<CallRi extends t_ri_any = t_ri_any, Content = any> = (transmission: i_request<CallRi>) => Promise<Content>;
    export interface i_reception<SubscriptionCallRI extends t_ri_any = t_ri_any, AnnouncementTalkRi extends t_ri_any = t_ri_any> {
        Scope: t_scope;
        Namespace?: t_namespace;
        Talk: AnnouncementTalkRi;
        Listen: t_ri_any;
        Call: (transmission: i_talk<SubscriptionCallRI>) => any;
    }
    export interface i_announcement<TalkRi extends t_ri_any = t_ri_any> {
        Scope: t_scope;
        Namespace: t_namespace;
        Talk: TalkRi;
    }
    export enum e_ServiceGroup {
        Standard = 0
    }
    export interface i_staticContentArchive {
        [channel: string]: {
            [unique_request_code: string]: i_response<any>;
        };
    }
    export interface i_localControllerStack {
        [namespace: string]: BaseController;
    }
    export interface i_sequenceStep {
        StartMessage?: string;
        EndMessage?: string;
        Listen: t_ri;
        List: t_namespace[];
        Talk?: t_ri;
    }
    export interface i_map<T> {
        [key: string]: T;
    }
    interface i_transmission {
        Sender: t_namespace;
        Recipient: t_namespace;
        Channel: t_channel;
        Error?: i_error;
        Time: t_epoch;
        Scope: e_Scope;
    }
    export interface i_talk<TalkRi extends t_ri_any = t_ri_any> extends i_transmission {
        Talk: TalkRi;
    }
    export interface i_response<Content = any> extends i_transmission {
        Group: e_ServiceGroup;
        Talk: t_ri_any;
        Content: Content;
        Id: t_serviceId;
        Static: boolean;
        LastDynamicTime?: t_epoch;
    }
    export interface i_request<TalkRi extends t_ri_any = t_ri_any> extends i_transmission {
        Group: e_ServiceGroup;
        Talk: TalkRi;
        Id: t_serviceId;
        Static: boolean;
    }
    export interface i_announcementPacket<TalkRi> {
        Channel: t_channel;
        Sender: t_namespace;
        Recipient: t_namespace;
        Talk: TalkRi;
        Time: t_epoch;
        Static: boolean;
        Scope: e_Scope;
    }
    export interface i_EventEmitter {
        new (): this;
        once(channel: t_channel, response: any): void;
        on(channel: t_channel, packet: any): void;
        emit(channel: t_channel, packet: any): void;
        eventNames(): Array<any>;
        setMaxListeners(listener_count: number): this;
    }
    export interface i_dialogueArchiveItem {
        Meta: {
            Elapsed: t_epoch;
            State: "Fail" | "Success";
        };
        Request: i_request;
        Response: i_response<any>;
    }
    export interface i_announcementArchiveItem {
        Namespace: t_namespace;
        Channel: t_channel;
        Content: any;
        Time: t_epoch;
    }
    export type t_waitActionCallback<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> = (transmission: i_talk<TalkRi>) => i_talk<TalkRi> | Return;
    export type t_waitTestCallback<TalkRi extends t_ri_any = t_ri_any> = (transmission: i_talk<TalkRi>) => boolean;
    export type t_waitPromiseResponse<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> = (reason: t_wait<TalkRi, Return> | Promise<t_wait<TalkRi, Return>>) => t_wait<TalkRi, Return>;
    export type t_wait<TalkRi extends t_ri_any = t_ri_any, Return = any> = i_talk<TalkRi> | Return;
    export {};
}

declare module '@utkusarioglu/controller/Common/separator_handler' {
    import { i_map } from "@utkusarioglu/controller/Common/t_controller";
    export abstract class SeparatorHandler {
        protected static _SEPARATOR: i_map<string>;
        constructor();
        protected set_Separators_FromGlobal(): void;
        protected set_Separators(separators: i_map<string>): void;
        protected get_Separator(separator_name: string): string;
    }
}

declare module '@utkusarioglu/controller/BaseController/base_controller' {
    import { SeparatorHandler } from "@utkusarioglu/controller/Common/separator_handler";
    import { i_waitSet, e_ServiceGroup, e_Scope, t_singleScope, t_epoch, i_talk, i_request, i_response, i_dialogueArchiveItem, i_announcementArchiveItem, t_waitActionCallback, t_waitTestCallback, t_wait } from "@utkusarioglu/controller/Common/t_controller";
    import { t_ri } from "@utkusarioglu/resolver";
    import { t_namespace } from "@utkusarioglu/namespace";
    import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";
    export class BaseController extends SeparatorHandler {
        constructor(controller_scope: t_singleScope, event_emitter: any);
        request<Content>(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_ri_any, scope: e_Scope, group: e_ServiceGroup): Promise<i_response<Content>>;
        respond<CallRi extends t_ri_any = t_ri_any, Content = any>(responder_namespace: t_namespace, response_callback: (transmission: i_request<CallRi>) => Promise<Content>, scope: e_Scope, group: e_ServiceGroup): void;
        get_DialogueArchive(): Array<i_dialogueArchiveItem>;
        publicget_ServedChannels(): any[];
        announce<TalkRi extends t_ri_any>(sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: TalkRi, scope: t_singleScope, delay?: boolean | t_epoch): void;
        get_AnnouncementArchive(): Array<i_announcementArchiveItem>;
        subscribe<TalkRi extends t_ri_any = t_ri_any>(listen: t_ri, callback: (transmission: i_talk<TalkRi>) => void, subcribed_namespace: t_namespace, scope: t_singleScope): void;
        wait<TalkRi extends t_ri_any = t_ri_any, Return = any>(waiter_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_ri, test_callback: t_waitTestCallback<TalkRi> | undefined, action_callback: t_waitActionCallback<TalkRi, Return> | undefined, scope: t_singleScope, total_count?: number, current_count?: number): Promise<t_wait<TalkRi, Return>>;
        wait_Some<TalkRi extends t_ri_any = t_ri_any, Return = any>(scope: t_singleScope, waiter_namespace: t_namespace, wait_set: Array<i_waitSet<TalkRi, Return>>): Promise<Array<t_wait<TalkRi, Return>>>;
    }
}

