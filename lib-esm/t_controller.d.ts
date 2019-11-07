import { BaseController } from "./base_controller";
import { t_resolutionInstructionNoArgs, t_resolutionInstruction } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
export declare type t_epoch = number;
export declare enum e_Scope {
    Local = 1,
    Global = 10,
    LocalAndGlobal = 11
}
export declare type t_scope = e_Scope;
export declare type t_singleScope = e_Scope.Local | e_Scope.Global;
export declare type t_error = {};
export declare type t_channel = string;
export declare type t_serviceId = string;
export declare type t_waitSet = {
    Namespace: t_namespace;
    Listen: t_resolutionInstructionNoArgs;
    Test?: (transmission: t_transmission) => boolean;
    Call?: (transmission: t_transmission) => any;
};
export declare type t_transmissionContent = any;
export declare type t_transmission = {
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
export declare type t_dependency_group = {
    Scope: t_singleScope;
    Members: t_waitSet[];
    Call: (value: any) => Promise<any>;
};
export declare type t_subscription = {
    Scope: t_scope;
    Namespace: t_namespace;
    Listen: t_resolutionInstructionNoArgs;
    Call: (value: any) => any;
};
export declare type t_service = {
    Scope: t_scope;
    Namespace: t_namespace;
    Listen: t_resolutionInstructionNoArgs;
    Call: (value: any) => any;
    Static?: boolean;
    Group: e_ServiceGroup;
};
export declare type t_reception = {
    Scope: t_scope;
    Namespace?: t_namespace;
    Talk: t_resolutionInstruction;
    Listen: t_resolutionInstructionNoArgs;
    Call: (value: any) => any;
};
export declare type t_announcement = {
    Scope: t_scope;
    Namespace: t_namespace;
    Talk: any;
};
export declare enum e_ServiceGroup {
    Standard = 0
}
export declare type t_staticContentArchive = {
    [channel: string]: {
        [unique_request_code: string]: t_transmission;
    };
};
export declare type t_localControllerStack = {
    [namespace: string]: BaseController;
};
export declare type t_sequenceStep = {
    StartMessage?: string;
    EndMessage?: string;
    Listen: t_resolutionInstructionNoArgs;
    List: t_namespace[];
    Talk?: t_resolutionInstructionNoArgs;
};
export declare type t_controllerGenericObj = {
    [key: string]: any;
};