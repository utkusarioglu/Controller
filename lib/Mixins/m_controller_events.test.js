"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_events_1 = require("./m_controller_events");
const t_controller_1 = require("../Common/t_controller");
const c_controller_1 = require("../Common/c_controller");
test("App_Controller", () => {
    const app_class_expression = class extends m_controller_events_1.M_ControllerEvents {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return c_controller_1.C_Controller.AllServices;
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
        manage_BootUp() {
            const sequence_members = this.get_Controller().get_GlobalNamespaces();
            const sequence_steps = [
                {
                    List: ["Child/Class/1"],
                    Listen: c_controller_1.C_BootState.ClassReady,
                },
            ];
            const sequence_manager = this.manage_ControllerSequence(sequence_steps, t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices)
                .then(() => {
                return "end";
            });
            console.log("sequence_manager\n", sequence_manager, "\n", sequence_members);
            return sequence_manager;
        }
    };
    const child_class_exp1 = class extends m_controller_events_1.M_ControllerEvents {
        constructor() {
            super();
            this.set_ControllerEvents();
        }
        get_GlobalNamespace() {
            return "Child/Class/1";
        }
        has_LocalNamespace() {
            return false;
        }
        set_ControllerEvents() {
            this
                .initialize_Controller();
        }
    };
    const child = (new child_class_exp1());
    const manager = (new app_class_expression());
    const sequence = new Promise((resolve) => {
        setTimeout(() => {
            return manager.manage_BootUp();
        }, 1000);
    });
    return expect(sequence).resolves.toBe("end");
});
//# sourceMappingURL=m_controller_events.test.js.map