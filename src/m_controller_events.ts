﻿/*
 *	MIXINS
 */
import { M_State } from "@utkusarioglu/state";
import { M_Namespace, t_namespace } from "@utkusarioglu/namespace";
import { M_Controller } from "./m_controller";

/*
 *	CONSTANTS
 */
import { C_Controller } from "./c_controller";

/*
 *	DATA TYPES
 */
import {
    t_subscription,
    t_reception,
    t_dependency_group,
    t_service,
    t_announcement,
    e_Scope,
    e_ServiceGroup,
    t_transmission,
    t_singleScope,
    t_sequenceStep,
} from "./t_controller";
import {
    t_resolutionInstructionNoArgs,
    t_resolutionInstruction
} from "@utkusarioglu/resolver";

/**
 * Provides autocorrect for the class
 * 
 * @requires M_Controller
 *
 * @remarks
 * Class: M_ControllerEvents
 * Service: Controller
 * */
export interface M_ControllerEvents extends
    M_State,
    M_Namespace,
    M_Controller
{ }



/**
 * Introduces methods for registering subscriptions, dependencies, announcements, and 
 * services for the extending class Handles the order of operations for the controller 
 * to run smoothly
 * The associated controller needs to be run by the child class 
 * Global (and if needed, Local) namespaces need to be set before the initializer is run
 * Needs @link State function to be defined in the parent to determine the local namespace
 * 
 * @remarks
 * Service: Controller
 * */
export abstract class M_ControllerEvents {

/*
 *	LOGS
 */
    private _subscriptions!: Array<t_subscription>;
    private _announcements!: Array<t_announcement>;
    private _receptions!: Array<t_reception>; // this isn't emitted, it's only for archiving
    private _dependencies!: Array<t_dependency_group>;
    private _services!: Array<t_service>;



/*
 * ======================================================== Boundary 1 =========
 *
 *	DECLARATION
 *	
 *	Declaration of controls by the instantiating class
 *
 * =============================================================================
 */

/* ---------------------------------------------------------- Use Case ---------
 *	INCLUDE CONTROLS
 */

    /**
     * Includes the given array items among the subscriptions for the set local 
     * or global namespace
     * 
     * @param subscription_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    include_Subscriptions(subscription_list: Array<t_subscription>): this {

        if (!this._subscriptions) {
            this._subscriptions = [];
        }

        this._subscriptions.push(...subscription_list);
        return this;
    }

    /**
     * Includes the given array items among the dependencies for the set local 
     * or global namespace
     * 
     * @param dependencies_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    include_Dependencies(dependencies_list: t_dependency_group[]): this {

        if (!this._dependencies) {
            this._dependencies = [];
        }

        this._dependencies.push(...dependencies_list);
        return this;
    }

    /**
     * Includes the given array items among announcement and subscriptions.
     * Unlike other methos, this registers 2 different events
     * 
     * @param reception_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    include_Receptions(reception_list: t_reception[]): this {

        if (!this._receptions) {
            this._receptions = [];
        }

        if (!this._subscriptions) {
            this._subscriptions = [];
        }

        if (!this._announcements) {
            this._announcements = [];
        }

        this._receptions.push(...reception_list);

        reception_list.forEach((reception: t_reception) => {

            this._subscriptions.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace || this.get_GlobalNamespace(),
                Listen: reception.Listen,
                Call: reception.Call,
            } as t_subscription);

            this._announcements.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace,
                Talk: reception.Talk,
            } as t_announcement);
        });

        return this;
    }

    /**
     * Includes the given array items among the services for the set local or global namespace
     * 
     * @param services_list
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    include_Services(services_list: t_service[]): this {

        if (!this._services) {
            this._services = [];
        }

        this._services.push(...services_list);
        return this;
    }



/*
 * ======================================================== Boundary 1 =========
 *
 *	IMPLEMENTATION
 *	
 *	Registration of controls
 *	Announcement of startup states
 *
 * =============================================================================
 */

/* ---------------------------------------------------------- Use Case ---------
 *	INITIALIZE CONTROLS
 */

    /**
     * Runs listen and talk operations in the order and times that they are supposed to be run
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     * */
    initialize_Controller(): this {

        this.set_Controller();

        setTimeout(
            this.announce_ToAllServices.bind(this, C_BootState.ClassReady),
            C_Controller.GraceTime
        );

        // Listens
        this.get_Controller()
            .wait(
                e_Scope.Global,
                C_Controller.AllServices,
                C_StartupTalk.run_Listen,
                undefined,
                () => {

                    this.register_Dependencies();
                    this.register_Subscriptions();

                    this.announce_ToAllServices(C_BootState.ListenReady);
                }
            );

        // Talks
        this.get_Controller()
            .wait(
                e_Scope.Global,
                C_Controller.AllServices,
                C_StartupTalk.run_Talk,
                undefined,
                () => {

                    this.register_Announcements();
                    this.register_Services();

                    this.announce_ToAllServices(C_BootState.TalkReady);
                }
            );

        return this;
    }



/* ---------------------------------------------------------- Use Case ---------
 *	REGISTER CONTROLS
 *	
 *  These are used by the method {@link initialize_Controller} to register included controls
 */

    /**
     * Excetutes controller for the subscriptions that were registered by the include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     * */
    private register_Subscriptions(): void {
        if (this._subscriptions) {
            this._subscriptions.forEach((subscription: t_subscription) => {
                this.get_Controller().subscribe(
                    subscription.Scope,
                    subscription.Namespace,
                    subscription.Listen,
                    subscription.Call
                )
            });
        }
    }

    /**
     * Excetutes controller for the dependencies that were registered by the include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     * */
    private register_Dependencies(): void {
        if (this._dependencies && this._dependencies.length > 0) {
            this._dependencies
                .forEach((dependency: t_dependency_group) => {
                    this.get_Controller().wait_Some(dependency.Scope, dependency.Members)
                        .then(data => {
                            return dependency.Call(data);
                        })
                        .then(this.announce_ToAllServices.bind(this, C_BootState.DependencyReady));
            });
        } else {
            this.announce_ToAllServices(C_BootState.DependencyReady);
        }
    }

    /**
     * Excetutes controller for the announcements that were registered by the include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     * */
    private register_Announcements(): void {
        if (this._announcements) {
            this._announcements.forEach((announcement: t_announcement) => {
                this.get_Controller().announce(
                    announcement.Scope,
                    announcement.Namespace,
                    announcement.Talk
                );
            });
        }
    }

    /**
     * Excetutes controller for the services that were registered by the include method
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     * */
    private register_Services(): void {
        if (this._services) {
            this._services.forEach((service: t_service) => {
                this.get_Controller().respond(
                    service.Scope,
                    service.Call,
                    service.Static || false,
                    e_ServiceGroup.Standard
                );
            }); 
        }
    }



/* ---------------------------------------------------------- Use Case ---------
 *	MANAGE CONTROLLER SEQUENCES
 */

    /**
     * Executes the provided Controller talks and listens in sequence
     * 
     * @param sequence_steps
     * @param scope
     * @param manager_namespace
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected manage_ControllerSequence(
        sequence_steps: Array<t_sequenceStep>,
        scope: t_singleScope,
        manager_namespace: t_namespace
    ): Promise<void> {

        let step_promise_stack: Array<Promise<t_resolutionInstructionNoArgs>> = [];
        let steps_promise_sequence: Promise<void> = Promise.resolve();

        sequence_steps.forEach((step, index) => {

            step_promise_stack[index] = new Promise((resolve_step_promise) => {

                return this.get_Controller().wait(
                    scope,
                    manager_namespace,
                    step.Listen,
                    (transmission: t_transmission) => {

                        step.List = step.List.filter((value: string) => {
                            return value !== transmission.Sender;
                        });

                        return step.List.length < 1;
                    },
                    () => {
                        return resolve_step_promise(step.Listen);
                    }
                ) // return this.get_Controller().wait

            }); // step_promise_stack[index]

            steps_promise_sequence = steps_promise_sequence
                .then(() => {

                    step.sniff(["StartMessage"], undefined,
                        (start_message: string) => {
                            console.log(start_message)
                        })

                    step.sniff(["Talk"], undefined,
                        (step_talk: t_resolutionInstructionNoArgs) => {
                            this.get_Controller().announce(
                                scope,
                                manager_namespace,
                                step_talk
                            );
                        });

                    return step_promise_stack.sniff([(index).toString()],
                        () => {
                            throw new Error(`Active step requires ${index} members`)
                        },
                        () => {
                            const active_step_promise_stack =
                                step_promise_stack.slice(0, index + 1);
                            return Promise.all(active_step_promise_stack)
                        })

                }); // steps_promise_sequence.then

        }); // sequence_steps.forEach

        return steps_promise_sequence;

    }


/* ---------------------------------------------------------- Use Case ---------
 *	ANNOUNCE STATES 
 */

    /**
     * Standardized method for announcing to all services
     * 
     * @param resolution_instruction
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected announce_ToAllServices(resolution_instruction: t_resolutionInstruction): void {
        this.get_Controller().announce(
            e_Scope.Global,
            C_Controller.AllServices,
            resolution_instruction,
            true
        );
    }

    /**
     * Standardized method for library adding
     * 
     * @param library_source_namespace
     *
     * @remarks
     * Class: M_ControllerEvents
     * Service: Controller
     */
    protected announce_LibraryAdded(library_source_namespace: t_namespace): void {
        this.get_Controller().announce(
            e_Scope.Global,
            C_Controller.AllServices,
            [...C_BootState.LibraryAdded, [library_source_namespace]] as t_resolutionInstruction,
            true
        )
    }

}