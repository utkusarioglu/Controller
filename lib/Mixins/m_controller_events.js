"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m_controller_1 = require("./m_controller");
const c_controller_1 = require("../Common/c_controller");
const t_controller_1 = require("../Common/t_controller");
class M_ControllerEvents extends m_controller_1.M_Controller {
    include_Subscriptions(subscription_list) {
        if (!this._subscriptions) {
            this._subscriptions = [];
        }
        this._subscriptions.push(...subscription_list);
        return this;
    }
    include_Dependencies(dependencies_list) {
        if (!this._dependencies) {
            this._dependencies = [];
        }
        this._dependencies.push(...dependencies_list);
        return this;
    }
    include_Receptions(reception_list) {
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
        reception_list.forEach((reception) => {
            this._subscriptions.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace || this.get_GlobalNamespace(),
                Listen: reception.Listen,
                Call: reception.Call,
            });
            this._announcements.push({
                Scope: reception.Scope,
                Namespace: reception.Namespace,
                Talk: reception.Talk,
            });
        });
        return this;
    }
    include_Services(services_list) {
        if (!this._services) {
            this._services = [];
        }
        this._services.push(...services_list);
        return this;
    }
    initialize_Controller() {
        this.set_Controller();
        this.announce_ToAllServices.bind(this, c_controller_1.C_BootState.ClassReady, 1000),
            this.get_Controller()
                .wait(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_StartupTalk.run_Listen, undefined, () => {
                this.register_Dependencies();
                this.register_Subscriptions();
                this.announce_ToAllServices(c_controller_1.C_BootState.ListenReady);
            });
        this.get_Controller()
            .wait(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, c_controller_1.C_StartupTalk.run_Talk, undefined, () => {
            this.register_Announcements();
            this.register_Services();
            this.announce_ToAllServices(c_controller_1.C_BootState.TalkReady);
        });
        return this;
    }
    register_Subscriptions() {
        if (this._subscriptions) {
            this._subscriptions.forEach((subscription) => {
                this.get_Controller().subscribe(subscription.Scope, subscription.Namespace, subscription.Listen, subscription.Call);
            });
        }
    }
    register_Dependencies() {
        if (this._dependencies && this._dependencies.length > 0) {
            this._dependencies
                .forEach((dependency) => {
                this.get_Controller().wait_Some(dependency.Scope, dependency.Members)
                    .then((data) => {
                    return dependency.Call(data);
                })
                    .then(this.announce_ToAllServices.bind(this, c_controller_1.C_BootState.DependencyReady));
            });
        }
        else {
            this.announce_ToAllServices(c_controller_1.C_BootState.DependencyReady);
        }
    }
    register_Announcements() {
        if (this._announcements) {
            this._announcements.forEach((announcement) => {
                this.get_Controller().announce(announcement.Scope, announcement.Namespace, announcement.Talk);
            });
        }
    }
    register_Services() {
        if (this._services) {
            this._services.forEach((service) => {
                this.get_Controller().respond(service.Scope, service.Call, service.Static || false, t_controller_1.e_ServiceGroup.Standard);
            });
        }
    }
    manage_ControllerSequence(sequence_steps, scope, manager_namespace) {
        const step_promise_stack = [];
        let steps_promise_sequence = Promise.resolve();
        sequence_steps.forEach((step, index) => {
            step_promise_stack[index] = new Promise((resolve_step_promise) => {
                return this.get_Controller().wait(scope, manager_namespace, step.Listen, (transmission) => {
                    step.List = step.List.filter((value) => {
                        return value !== transmission.Sender;
                    });
                    return step.List.length < 1;
                    console.log(`remaining list: \n ${JSON.stringify(step.List)}`);
                }, () => {
                    return resolve_step_promise(step.Listen);
                });
            });
            steps_promise_sequence = steps_promise_sequence
                .then(() => {
                step.sniff(["StartMessage"], undefined, (start_message) => {
                    console.log(start_message);
                });
                step.sniff(["Talk"], undefined, (step_talk) => {
                    this.get_Controller().announce(scope, manager_namespace, step_talk);
                });
                return step_promise_stack.sniff([(index).toString()], () => {
                    throw new Error(`Active step requires ${index} members`);
                }, () => {
                    const active_step_promise_stack = step_promise_stack.slice(0, index + 1);
                    return Promise.all(active_step_promise_stack);
                });
            });
        });
        return steps_promise_sequence;
    }
    announce_ToAllServices(resolution_instruction, delay = 0) {
        this.get_Controller().announce(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, resolution_instruction, delay);
    }
    announce_LibraryAdded(library_source_namespace) {
        this.get_Controller().announce(t_controller_1.e_Scope.Global, c_controller_1.C_Controller.AllServices, [
            ...c_controller_1.C_BootState.LibraryAdded,
            [library_source_namespace],
        ], true);
    }
}
exports.M_ControllerEvents = M_ControllerEvents;
//# sourceMappingURL=m_controller_events.js.map