
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { Parent } from "@utkusarioglu/mixer";

/*
 *	LOCALS
 */
import { SampleControllerClass } from "./sample_controller_class";
import { t_namespace } from "@utkusarioglu/namespace";
import { M_ControllerEvents } from "../Mixins/m_controller_events";
import { M_Controller } from "../Mixins/m_controller";
import { BaseTestClass } from "./base_test_class";
import { C_BootState, C_StartupTalk, C_Controller } from "../Common/c_controller";
import { Controller } from "../Controller/controller";
import { i_sequenceStep, e_Scope } from "../Common/t_controller";




/* ////////////////////////////////////////////////////////////////////////////
 *
 *	EXPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

export interface SampleControllerEventsClass extends
    SampleControllerClass,
    M_ControllerEvents,
    M_Controller
{ }

export class SampleControllerEventsClass extends Parent(BaseTestClass).with(
    M_ControllerEvents,
    M_Controller,
) {

    constructor(
        class_namespace: t_namespace,
        channel: t_namespace = "channel",
        sequential: boolean = true
    ) {
        super(class_namespace, channel);
        this.set_ControllerEvents(sequential);
    }

    public set_ControllerEvents(sequential: boolean): this {
        this.initialize_Controller(sequential);
        return this;
    }

    public announce_ClassReady(): this {
        this.announce_ToAllServices(C_BootState.ClassReady)
        return this;
    }

    public set_SampleController(): this {
        this.set_Controller();
        return this;
    }

    public manage_BootUp(): Promise<string> {

        const sequence_members: t_namespace[] =
            Controller.get_GlobalNamespaces();

        const sequence_steps: i_sequenceStep[] = [
            {
                List: sequence_members,
                Listen: C_BootState.ClassReady,
            },
            {
                List: ["App/Child2"],
                Talk: C_StartupTalk.run_Listen,
                Listen: C_BootState.ListenReady,
            },
        ];


        const sequence_manager = this.manage_ControllerSequence(
            sequence_steps,
            e_Scope.Global,
            C_Controller.AllServices,
        )

        //return Promise.resolve(JSON.stringify(sequence_manager));

        return sequence_manager;

    } // Manage_BootUp


    public announce_ListenReady() {
    this.get_Controller().announce(
        C_BootState.ListenReady,
        C_Controller.AllServices,
        e_Scope.Global,
    )
}

}