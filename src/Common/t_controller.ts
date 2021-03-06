/*
 *	LOCAL CLASSES
 */
import { BaseController } from "../BaseController/base_controller";

/*
 *	DATATYPES
 */
import {
    t_ri0,
    t_ri,
} from "@utkusarioglu/resolver";

import { t_namespace } from "@utkusarioglu/namespace";
import { t_ri_any } from "@utkusarioglu/resolver/Common/t_resolver";


/*
 * ========================================================================== Boundary 1 =========
 *
 *	STAND INS
 *
 * ===============================================================================================
 */

/**
 * Number used as unix epoch
 */
export type t_epoch = number;







/*
 *	SCOPE
 */

/**
 * Legal scopes for the controller
 * 
 * Local only emits to local namespace (if defined)
 * Global emits to global namespace
 * LocalAndGlobal emits to both
 */
export enum e_Scope {
    Local = 1,
    Global = 10,
    LocalAndGlobal = 11,
}

/**
 * All legal values of e_Scope
 */
export type t_scope = e_Scope;

/**
 * Only single scope allowed
 */
export type t_singleScope = e_Scope.Local | e_Scope.Global;



/**
 * Contains specifications for the transmission error
 */
export interface i_error {
    // TODO
}


/**
 * Alias for string to denote channel
 */
export type t_channel = string;

/**
 * Alias for string to denote the unique service id
 */
export type t_serviceId = string;

/**
 * Stores specifications required for the wait method to run
 */
export interface i_waitSet<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> {
    /** Namespace of the target that is being waited*/
    Namespace: t_namespace;
    /** the resolution to listen to */
    Listen: t_ri;
    /** callback function to determine if the emit from the awaited meets the requirements*/
    Test?: t_waitTestCallback<TalkRi>;
    /** callback to be executed once the awaited passes the test*/
    Call?: t_waitPromiseResponse<TalkRi, Return>;
}

/**
 * Alias for any to denote the content transmitted via t_transmission
 */
export type t_transmissionContent = any;


/**
 * Datatype for instructing multiple waits followed by a call
 */
export interface i_dependency_group<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_singleScope;
    /** Dependency members to be waited*/
    Members: i_waitSet<TalkRi, Return>[];
    /** Callback function to be executed once all the dependencies become available*/
    Call: (value: any) => Promise<any>;
}

/**
 * Datatype for instructing monitor of a channel
 */
export interface i_subscription<CallRi extends t_ri_any = t_ri_any> {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** The namespace that is being subscribed to*/
    Namespace: t_namespace;
    /** Resolution that is being subscribed at */
    Listen: t_ri;
    /** Callback function to be executed when the subscription emits*/
    Call: (transmission: i_talk<CallRi>) => void;
}

/**
 * Datatype for instructing monitor of a channel followed by a call whose 
 * return is emitted to the requester
 */
export interface i_service<CallRi extends t_ri_any = t_ri_any, ReturnContent = any> {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is expected to respond to the request*/
    //Namespace: t_namespace;
    /** Specific method that is being requested*/
    //Listen?: t_ri_any;
/** Callback function to be executed on the response transmission*/
    Call: t_serviceCallback<CallRi, ReturnContent>
    /** Whelther the service is static */
    Static?: boolean;
    /** Service group */
    Group?: e_ServiceGroup;
}

/**
 * Defines the callback function respond and include_services
 */
export type t_serviceCallback<CallRi extends t_ri_any = t_ri_any, Content = any> =
    (transmission: i_request<CallRi>) => Promise<Content>;

/**
 * Datatype for announcing a listening channel to which multiple clases can independently 
 * send data towards, which will independently handled by the call function
 */
export interface i_reception<
        SubscriptionCallRI extends t_ri_any = t_ri_any,
        AnnouncementTalkRi extends t_ri_any = t_ri_any,
    > {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace that is accepting the admissions */
    Namespace?: t_namespace;
    /** Announcement resolution */
    Talk: AnnouncementTalkRi;
    /** Listening resolution */
    Listen: t_ri_any;
    /** function that will be called when another node emits to the channel (namespace + . + method) */
    Call: (transmission: i_talk<SubscriptionCallRI>) => any;
}

/**
 * Datatype for instructing emit of data to a certain channel without any 
 * following listening activity by the emitter
 */
export interface i_announcement<TalkRi extends t_ri_any = t_ri_any> {
    /** 1: Local, 2 or 10: global, 3 or 11: global + local */
    Scope: t_scope;
    /** Namespace of the announcer*/
    Namespace: t_namespace;
    /** the resolution that will be processed by the target */
    Talk: TalkRi;
}

export enum e_ServiceGroup {
    Standard,
}

/**
 * Data structure for Controller class static content archive
 */
export interface i_staticContentArchive {
    [channel: string]: {
        [unique_request_code: string]: i_response<any>,
    };
}

/**
 * Stores local controllers
 */
export interface i_localControllerStack {
    [namespace: string]: BaseController;
}




/**
 * Defines the properties necessary for executing one step
 */
export interface i_sequenceStep {
    /** Console mesage for the start of the step if enabled */
    StartMessage?: string;
    /** Console mesage for the end of the step if enabled */
    EndMessage?: string;
    /** Instruction to be listened to for determining the services' completion of the step */
    Listen: t_ri;
    /** List of namespaces that are required to complete the step */
    List: t_namespace[];
    /** Instruction to announce to listening services that the step execution is shall 
     * be carried out. Some steps may not require a talk as the execution starts through 
     * some other method */
    Talk?: t_ri;
}

/**
 * Generic mapping object for Controller
 */
export interface i_map<T> { [key: string]: T; }









/**
 * Contains keys that are expected to be transmitted by controller methods
 */
interface i_transmission {

    /** namespace of the sender*/
    Sender: t_namespace;

    /** namespace of the recipient*/
    Recipient: t_namespace;

    /** Redundant info for ease of access, concatenating:
     * 1- recipient namespace  
     * 2- method or announcement separator (whichever applies)
     * 3- service group
     * 4- id separator (if applies)
     * 5- id (if applies)
     */
    Channel: t_channel;

    /** Error content if an error occured*/
    Error?: i_error;

    /** epoch when the transmission occured */
    Time: t_epoch;

    Scope: e_Scope;
}




/**
 * Sub set of t_transmission for talk event
 */
export interface i_talk<TalkRi extends t_ri_any = t_ri_any> extends i_transmission {
    /** Talking that is involved with the transmission*/
    Talk: TalkRi;
}

/**
 * Extends t_transmission for response event 
 */
export interface i_response<Content = any> extends i_transmission {
    /** denotes the service group in service transmissions */
    Group: e_ServiceGroup;
    /** Talking that is involved with the transmission*/
    Talk: t_ri_any;
    /** transmission content that is created by the responder */
    Content: Content;
    /** Unique request code*/
    Id: t_serviceId;
    Static: boolean;
    LastDynamicTime?: t_epoch;
}

export interface i_request<TalkRi extends t_ri_any = t_ri_any> extends i_transmission {
    Group: e_ServiceGroup,
    Talk: TalkRi,
    Id: t_serviceId,
    Static: boolean,
}














export interface i_announcementPacket<TalkRi> {
    Channel: t_channel,
    Sender: t_namespace,
    Recipient: t_namespace,
    Talk: TalkRi,
    Time: t_epoch,
    Static: boolean,
    Scope: e_Scope,
}

/**
 * Interface for all event emitters that controller uses
 */
export interface i_EventEmitter {
    new(): this
    once(channel: t_channel, response: any): void
    on(channel: t_channel, packet: any): void
    emit(channel: t_channel, packet: any): void
    eventNames(): Array<any>;
    setMaxListeners(listener_count: number): this
}

/**
 * Dialogue archive item structure
 */
export interface i_dialogueArchiveItem {
    Meta: {
        Elapsed: t_epoch,
        State: "Fail" | "Success",
    },
    Request: i_request,
    Response: i_response<any>,
}

/**
 * Annoucement archive item structure
 */
export interface i_announcementArchiveItem {
    Namespace: t_namespace,
    Channel: t_channel,
    Content: any,
    Time: t_epoch,
}

/**
 * Alias for wait action callback
 */
export type t_waitActionCallback<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> =
    (transmission: i_talk<TalkRi>) => i_talk<TalkRi> | Return;

/**
 * Alias for wait test callback
 */
export type t_waitTestCallback<TalkRi extends t_ri_any = t_ri_any> =
    (transmission: i_talk<TalkRi>) => boolean

/**
 * Alias for wait promise resolve
 */
export type t_waitPromiseResponse<TalkRi extends t_ri_any = t_ri_any, Return = i_talk<TalkRi>> =
    (reason: t_wait<TalkRi, Return> | Promise<t_wait<TalkRi, Return>>) => t_wait<TalkRi, Return>

export type t_wait<
    TalkRi extends t_ri_any = t_ri_any,
    Return = any
    > = i_talk<TalkRi> | Return;