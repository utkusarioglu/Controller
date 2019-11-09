import { M_ControllerEvents } from "./m_controller_events";
import { t_namespace } from "@utkusarioglu/namespace";
import { t_sequenceStep, e_Scope } from "../Common/t_controller";
import {
    C_BootState,
    C_StartupTalk,
    C_Controller
} from "../Common/c_controller";

test("App_Controller", () => {

    const app_class_expression = class extends M_ControllerEvents {

        constructor() {
            super();
            this.set_ControllerEvents();
        }

        public get_GlobalNamespace(): string {
            return C_Controller.AllServices;
        }

        public has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
                //.manage_BootUp();
        }

        public manage_BootUp(): Promise<string> {

            const sequence_members: t_namespace[] =
                this.get_Controller().get_GlobalNamespaces();

            const sequence_steps: t_sequenceStep[] = [
                {
                    // announced by initialize_Controller
                    //StartMessage: "Services Initializing",
                    //List: sequence_members,
                    List: ["Child/Class/1"],
                    Listen: C_BootState.ClassReady,
                },
            ];

            const sequence_manager = this.manage_ControllerSequence(
                sequence_steps,
                e_Scope.Global,
                C_Controller.AllServices,
            )
                .then(() => {
                    return "end";
                })

            console.log("sequence_manager\n", sequence_manager, "\n", sequence_members)

            return sequence_manager;

        } // Manage_BootUp

    };



    const child_class_exp1 = class extends M_ControllerEvents {

        constructor() {
            super();
            this.set_ControllerEvents();

        }

        get_GlobalNamespace(): string {
            return "Child/Class/1"
        }

        has_LocalNamespace(): boolean {
            return false;
        }

        private set_ControllerEvents(): void {
            this
                .initialize_Controller();
        }

    }

    const child = (new child_class_exp1());
    const manager = (new app_class_expression());

    const sequence: Promise<string> = new Promise((resolve) => {
        setTimeout(() => {
            //return resolve("end")
            return manager.manage_BootUp();
        }, 1000)
    });

    return expect(sequence).resolves.toBe("end");

});
