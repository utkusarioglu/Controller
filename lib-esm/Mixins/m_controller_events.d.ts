import { M_State } from "@utkusarioglu/state";
import { M_Namespace } from "@utkusarioglu/namespace";
import { M_Controller } from "./m_controller";
import { i_subscription, i_reception, i_dependency_group, i_service, t_singleScope, i_sequenceStep, i_talk } from "../Common/t_controller";
import { t_ri, t_ri_any } from "@utkusarioglu/resolver";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_epoch } from "@utkusarioglu/state/t_state";
export interface M_ControllerEvents extends M_Controller, M_State, M_Namespace {
}
export declare abstract class M_ControllerEvents {
    private _subscriptions;
    private _announcements;
    private _receptions;
    private _dependencies;
    private _services;
    include_Subscriptions<SubscriptionCallRI extends t_ri_any = t_ri_any>(subscription_list: Array<i_subscription<SubscriptionCallRI>>): this;
    include_Dependencies<TalkRi extends t_ri_any = t_ri_any, Return extends i_talk = i_talk<TalkRi>>(dependencies_list: i_dependency_group<TalkRi, Return>[]): this;
    include_Receptions<SubscriptionCallRi extends t_ri_any = t_ri_any, AnnouncementTalkRi extends t_ri_any = t_ri_any>(reception_list: i_reception<SubscriptionCallRi, AnnouncementTalkRi>[]): this;
    include_Services<CallRi extends t_ri_any = t_ri_any, CallReturn = any>(services_list: i_service<CallRi, CallReturn>[]): this;
    initialize_Controller(sequential_startup?: boolean): this;
    private register_Subscriptions;
    private register_Dependencies;
    private register_Announcements;
    private register_Services;
    protected manage_ControllerSequence(sequence_steps: Array<i_sequenceStep>, scope: t_singleScope, manager_namespace: t_namespace): Promise<any>;
    produce_PromiseStackMember(scope: t_singleScope, manager_namespace: t_namespace, step: i_sequenceStep): Promise<t_ri>;
    private produce_StepsPromise;
    protected announce_ToAllServices(resolution_instruction: t_ri, delay?: t_epoch): void;
    protected announce_LibraryAdded(library_source_namespace: t_namespace): void;
}
