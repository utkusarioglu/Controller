"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base_controller");
const c_controller_1 = require("../Common/c_controller");
const sample_controller_class_1 = require("../TestSupport/sample_controller_class");
const t_controller_1 = require("../Common/t_controller");
test("ActiveEmitter", () => {
    const ee = new sample_controller_class_1.ActiveEmitter();
    const channel = "thing";
    const transmission_value = "transmission_value";
    const on_promise = new Promise((resolve, reject) => {
        ee.on(channel, (transmission) => {
            resolve(transmission);
        });
    });
    ee.emit(channel, transmission_value);
    return expect(on_promise).resolves.toBe(transmission_value);
});
test("BaseController.subscribe&announce.Global", () => {
    const namespace = "subscribed/namespace";
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Global, sample_controller_class_1.ActiveEmitter);
    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, namespace, t_controller_1.e_Scope.Global);
    });
    base_controller.announce("base_controller2", c_controller_1.C_BootState.ClassReady, namespace, t_controller_1.e_Scope.Global);
    return expect(subscription).resolves.toStrictEqual(c_controller_1.C_BootState.ClassReady);
});
test("BaseController.subscribe&announce.Global.Count", () => {
    const namespace = "subscribed/namespace";
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Global, sample_controller_class_1.ActiveEmitter);
    const announcement_count = 10;
    const counter = new Promise((resolve, reject) => {
        let counter = 0;
        let log = [];
        base_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            counter++;
            log.push(transmission);
        }, namespace, t_controller_1.e_Scope.Global);
        setTimeout(() => resolve(counter), 1000);
    });
    for (let i = 0; i < announcement_count; i++) {
        base_controller.announce("base_controller2", c_controller_1.C_BootState.ClassReady, namespace, t_controller_1.e_Scope.Global);
    }
    return expect(counter).resolves.toStrictEqual(announcement_count);
});
test("BaseController.wait&announce.Global.Count", () => {
    const namespace = "subscribed/namespace";
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Global, sample_controller_class_1.ActiveEmitter);
    const announcement_count = 1;
    const counter = new Promise((resolve, reject) => {
        let counter = 0;
        let log = [];
        base_controller.wait("waiter", c_controller_1.C_BootState.ClassReady, namespace, undefined, (transmission) => {
            counter++;
            log.push(transmission);
        }, t_controller_1.e_Scope.Global);
        setTimeout(() => resolve(counter), 1000);
    });
    base_controller.announce("base_controller2", c_controller_1.C_BootState.ClassReady, namespace, t_controller_1.e_Scope.Global);
    return expect(counter).resolves.toStrictEqual(announcement_count);
});
test("BaseController.subscribe&announce.Local", () => {
    const namespace = "subscribed/namespace";
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Local, sample_controller_class_1.ActiveEmitter);
    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe(c_controller_1.C_BootState.ClassReady, (transmission) => {
            resolve(transmission.Talk);
        }, namespace, t_controller_1.e_Scope.Local);
    });
    base_controller.announce("base_controller2", c_controller_1.C_BootState.ClassReady, namespace, t_controller_1.e_Scope.Local);
    return expect(subscription).resolves.toStrictEqual(c_controller_1.C_BootState.ClassReady);
});
test("BaseController.wait", () => {
    const declaration_namespace = "declaration/namespace";
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Local, sample_controller_class_1.ActiveEmitter);
    const test_value = "test-value";
    let announcement_count = 0;
    const wait_promise = new Promise((resolve) => {
        base_controller.wait("waiting/for/emit", c_controller_1.C_BootState.ClassReady, declaration_namespace, (transmission) => {
            announcement_count++;
            return (transmission.Talk)[2][0]
                === test_value;
        }, (transmission) => {
            resolve(announcement_count);
        }, t_controller_1.e_Scope.Local);
    });
    base_controller.announce("base/controller/2", [...c_controller_1.C_BootState.ClassReady, ["not-test-value"]], declaration_namespace, t_controller_1.e_Scope.Local);
    base_controller.announce("base/controller/3", [...c_controller_1.C_BootState.ClassReady, ["not-test-value"]], declaration_namespace, t_controller_1.e_Scope.Local);
    base_controller.announce("base/controller/2", [...c_controller_1.C_BootState.ClassReady, [test_value]], declaration_namespace, t_controller_1.e_Scope.Local);
    return expect(wait_promise).resolves.toStrictEqual(3);
});
test("BaseController.wait_Some", () => {
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Global, sample_controller_class_1.ActiveEmitter);
    const declaration_namespace1 = "declaration/namespace/1";
    const declaration_namespace2 = "declaration/namespace/2";
    const test_value1 = "test-value-1";
    const test_value2 = "test-value-2";
    let announcement_count = 0;
    const wait_some = base_controller.wait_Some([
        {
            Namespace: declaration_namespace1,
            Listen: c_controller_1.C_BootState.ClassReady,
            Test: (transmission) => {
                announcement_count++;
                return (transmission.Talk)[2][0]
                    === test_value1;
            },
        },
        {
            Namespace: declaration_namespace2,
            Listen: c_controller_1.C_BootState.ClassReady,
            Test: (transmission) => {
                announcement_count++;
                return (transmission.Talk)[2][0]
                    === test_value2;
            },
        },
    ], "waiter/namespace", t_controller_1.e_Scope.Global).then((transmissions) => {
        return (transmissions).map((transmission) => {
            return (transmission.Talk)[2][0];
        });
    });
    base_controller.announce("1", [...c_controller_1.C_BootState.ClassReady, [test_value1]], declaration_namespace1, t_controller_1.e_Scope.Global);
    base_controller.announce("2", [...c_controller_1.C_BootState.ClassReady, ["not-test-value"]], declaration_namespace2, t_controller_1.e_Scope.Global);
    base_controller.announce("2", [...c_controller_1.C_BootState.ClassReady, [test_value2]], declaration_namespace2, t_controller_1.e_Scope.Global);
    return expect(wait_some).resolves.toStrictEqual([test_value1, test_value2]);
});
test("Basecontroller.service", () => {
    const base_controller = new base_controller_1.BaseController(t_controller_1.e_Scope.Global, sample_controller_class_1.ActiveEmitter);
    const responder_namespace = "responder/namespace";
    const sender_namespace = "sender/namespace";
    base_controller.respond(responder_namespace, (transmission) => {
        return new Promise((resolve) => {
            resolve(transmission);
        });
    }, t_controller_1.e_Scope.Global, t_controller_1.e_ServiceGroup.Standard);
    const response = base_controller.request(sender_namespace, ["RI", "set_Banana"], responder_namespace, t_controller_1.e_Scope.Global, t_controller_1.e_ServiceGroup.Standard)
        .then((transmission) => {
        return (transmission.Content).Time;
    });
    return expect(response).resolves.toBeGreaterThan(1000);
});
//# sourceMappingURL=base_controller.test.js.map