
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	LOCALS
 */
import { BaseController } from "./base_controller";

/*
 *	CONSTANTS
 */
import { C_BootState } from "../Common/c_controller";
import { ActiveEmitter } from "../TestSupport/sample_controller_class"

/*
 *	DATATYPES
 */
import { e_Scope, i_waitSet, e_ServiceGroup, i_talk, i_request } from "../Common/t_controller";
import { t_ri } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */


test("ActiveEmitter", () => {

    const ee = new ActiveEmitter();
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




// method get_Separator is normally protected, check its access 
// before running this test
// test("BaseController.SeparatorHandler.get_Separator", () => {

//    const base_controller_ins = new BaseController(e_Scope.Global);
//    const expression_sep = base_controller_ins.get_Separator("Expression");

//    expect(expression_sep).toBe(".");

// });

test("BaseController.subscribe&announce.Global", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Global, ActiveEmitter);

    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe<any>(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk);
            },
            namespace,
            e_Scope.Global,
        );

    });

    base_controller.announce(
        "base_controller2",
        namespace,
        C_BootState.ClassReady,
        e_Scope.Global,
    );

    return expect(subscription).resolves.toStrictEqual(C_BootState.ClassReady);

});

test("BaseController.subscribe&announce.Global.Count", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Global, ActiveEmitter);
    const announcement_count: number = 10;

    const counter = new Promise((resolve, reject) => {

        let counter: number = 0;
        let log: i_talk[] = [];

        base_controller.subscribe<any>(
            C_BootState.ClassReady,
            (transmission) => {
                counter++
                log.push(transmission);
            },
            namespace,
            e_Scope.Global,
        );

        setTimeout(() => resolve(counter), 1000)

    });


    for (let i = 0; i < announcement_count; i++) {
        base_controller.announce(
            "base_controller2",
            namespace,
            C_BootState.ClassReady,
            e_Scope.Global,
        );
    }

    return expect(counter).resolves.toStrictEqual(announcement_count);

});

test("BaseController.wait&announce.Global.Count", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Global, ActiveEmitter);
    const announcement_count: number = 1;

    const counter = new Promise((resolve, reject) => {

        let counter: number = 0;
        let log: i_talk[] = [];

        base_controller.wait<any>(
            "waiter",
            namespace,
            C_BootState.ClassReady,
            undefined,
            (transmission) => {
                counter++
                log.push(transmission);
            },
            e_Scope.Global,
        );

        setTimeout(() => resolve(counter), 1000)

    });


    //for (let i = 0; i < announcement_count; i++) {
    base_controller.announce(
        "base_controller2",
        namespace,
        C_BootState.ClassReady,
        e_Scope.Global,
    );
    //}

    return expect(counter).resolves.toStrictEqual(announcement_count);

});



test("BaseController.subscribe&announce.Local", () => {

    const namespace = "subscribed/namespace";
    const base_controller = new BaseController(e_Scope.Local, ActiveEmitter);

    const subscription = new Promise((resolve, reject) => {
        base_controller.subscribe(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk);
            },
            namespace,
            e_Scope.Local,
        );

    });

    base_controller.announce(
        "base_controller2",
        namespace,
        C_BootState.ClassReady,
        e_Scope.Local,
    );

    return expect(subscription).resolves.toStrictEqual(C_BootState.ClassReady);

});


test("BaseController.wait", () => {

    const declaration_namespace = "declaration/namespace";
    const base_controller = new BaseController(e_Scope.Local, ActiveEmitter);
    const test_value = "test-value";
    let announcement_count: number = 0;

    const wait_promise = new Promise((resolve) => {
        base_controller.wait<t_ri<[typeof test_value]>, void>(
            "waiting/for/emit",
            declaration_namespace,
            C_BootState.ClassReady,
            (transmission) => {
                announcement_count++;
                return (transmission.Talk)[2][0]
                    === test_value;
            },
            (transmission) => {
                resolve(announcement_count);
            },
            e_Scope.Local,
        );
    });

    base_controller.announce(
        "base/controller/2",
        declaration_namespace,
        [...C_BootState.ClassReady, ["not-test-value"] ] as t_ri<[typeof test_value]>,
        e_Scope.Local,
    );

    base_controller.announce(
        "base/controller/3",
        declaration_namespace,
        [...C_BootState.ClassReady, ["not-test-value"] ] as t_ri<[typeof test_value]>,
        e_Scope.Local,
    );

   
    base_controller.announce(
        "base/controller/2",
        declaration_namespace,
        [...C_BootState.ClassReady, [test_value]] as t_ri<[typeof test_value]>,
        e_Scope.Local,
    );

    return expect(wait_promise).resolves.toStrictEqual(3);

});



test("BaseController.wait_Some", () => {

    const base_controller = new BaseController(e_Scope.Global, ActiveEmitter);

    const declaration_namespace1 = "declaration/namespace/1";
    const declaration_namespace2 = "declaration/namespace/2";
    const test_value1 = "test-value-1";
    const test_value2 = "test-value-2";
    let announcement_count: number = 0;


    const wait_some = base_controller.wait_Some<
        t_ri<[string]>,
        i_talk<t_ri<[string]>>
    >(
        [
            {
                Namespace: declaration_namespace1,
                Listen: C_BootState.ClassReady,
                Test: (transmission) => {
                    announcement_count++;
                    return (transmission.Talk)[2][0]
                        === test_value1;
                },
            },
            {
                Namespace: declaration_namespace2,
                Listen: C_BootState.ClassReady,
                Test: (transmission) => {
                    announcement_count++;
                    return (transmission.Talk)[2][0]
                        === test_value2;
                },
            },
        ],
        "waiter/namespace",
        e_Scope.Global,
    ).then((transmissions) => {
        return (transmissions).map((transmission) => {

            return (transmission.Talk)[2][0];
        });
    });

    base_controller.announce(
        "1",
        declaration_namespace1,
        [...C_BootState.ClassReady, [test_value1]] as t_ri<[typeof test_value1]>,
        e_Scope.Global,
    );

    base_controller.announce(
        "2",
        declaration_namespace2,
        [...C_BootState.ClassReady, ["not-test-value"]] as t_ri<[string]>,
        e_Scope.Global,
    );

    base_controller.announce(
        "2",
        declaration_namespace2,
        [...C_BootState.ClassReady, [test_value2]] as t_ri<[typeof test_value2]>,
        e_Scope.Global,
    );

    // console.log("wait_some\n", wait_some);

    return expect(wait_some).resolves.toStrictEqual([test_value1, test_value2]);

});


test("Basecontroller.service", () => {

    const base_controller = new BaseController(e_Scope.Global, ActiveEmitter);
    const responder_namespace = "responder/namespace";
    const sender_namespace = "sender/namespace";

    base_controller.respond<
        t_ri<[string]>,
        i_request<t_ri<[string]>>
    >(
        responder_namespace,
        (transmission) => {
            return new Promise((resolve) => {
                resolve(transmission);
            });
        },
        e_Scope.Global,
        e_ServiceGroup.Standard,
    );

    const response = base_controller.request<i_request>(
        sender_namespace,
        responder_namespace,
        ["RI", "set_Banana"],
        e_Scope.Global,
        e_ServiceGroup.Standard,
    )
        .then((transmission) => {
            return (transmission.Content).Time;
        });

    return expect(response).resolves.toBeGreaterThan(1000);


});

