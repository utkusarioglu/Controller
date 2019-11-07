import { M_State } from "@utkusarioglu/state";
import { M_Namespace, t_namespace } from "@utkusarioglu/namespace";
import { M_Controller } from "./m_controller";
import { t_subscription, t_reception, t_dependency_group, t_service, t_singleScope, t_sequenceStep } from "./t_controller";
import { t_resolutionInstruction } from "@utkusarioglu/resolver";
export interface M_ControllerEvents extends M_State, M_Namespace, M_Controller {
}
export declare abstract class M_ControllerEvents {
    private _subscriptions;
    private _announcements;
    private _receptions;
    private _dependencies;
    private _services;
    include_Subscriptions(subscription_list: Array<t_subscription>): this;
    include_Dependencies(dependencies_list: t_dependency_group[]): this;
    include_Receptions(reception_list: t_reception[]): this;
    include_Services(services_list: t_service[]): this;
    initialize_Controller(): this;
    private register_Subscriptions;
    private register_Dependencies;
    private register_Announcements;
    private register_Services;
    protected manage_ControllerSequence(sequence_steps: Array<t_sequenceStep>, scope: t_singleScope, manager_namespace: t_namespace): Promise<void>;
    protected announce_ToAllServices(resolution_instruction: t_resolutionInstruction): void;
    protected announce_LibraryAdded(library_source_namespace: t_namespace): void;
}
