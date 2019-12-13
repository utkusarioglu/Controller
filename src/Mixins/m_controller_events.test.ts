
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	DEPENDENCIES
 */
import { t_trackRecord } from "@utkusarioglu/state/t_state";
import { Parent } from "@utkusarioglu/mixer";

/*
 *	LOCALS
 */
import { M_ControllerEvents } from "./m_controller_events";
import { Controller } from "../Controller/controller";
import { M_Controller } from "./m_controller";
import { SampleControllerEventsClass } from "../TestSupport/sample_controller_events_class";

/*
 *	CONSTANTS
 */
import {
    C_BootState,
    C_StartupTalk,
    C_Controller
} from "../Common/c_controller";

/*
 *	DATATYPES
 */
import { t_namespace } from "@utkusarioglu/namespace";
import { i_sequenceStep, e_Scope } from "../Common/t_controller";
import { ActiveEmitter } from "../TestSupport/sample_controller_class";
import { Resolution } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

test("skip", () => {
    expect(2).toStrictEqual(2)
})

test("App.Controller events participants", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    const talker_class = new SampleControllerEventsClass(
        "Talker",
        C_Controller.AllServices,
        false
    );
    //talker_class.initialize_Controller();

    const participants = Controller.get_GlobalNamespaces();

    expect(participants).toStrictEqual(["Observer", "Talker"])

});


test("App.Class Ready manual", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    talking_controller.announce(
            C_Controller.AllServices,
            C_BootState.ClassReady,
            e_Scope.Global,
            0,
        );

    return expect(subscription).resolves.toBe(C_BootState.ClassReady);

});


test("App.Class Ready, late announce", () => {

    Controller.flush_GlobalController();

    const listenting_controller = new Controller("Observer");
    const talking_controller = new Controller("Class");

    const subscription = new Promise((resolve) => {
        listenting_controller.subscribe<any>(
            C_BootState.ClassReady,
            (transmission) => {
                resolve(transmission.Talk)
            },
            C_Controller.AllServices,
        )
    });

    talking_controller.announce(
        C_Controller.AllServices,
        C_BootState.ClassReady,
        undefined,
        500
    )

    return expect(subscription).resolves.toBe(C_BootState.ClassReady);

});

test("App.SampleControllerEventsClass listen/talk", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    //listener_instance.set_SampleController();
    //talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    const talker = talker_instance.talk(message);

    const listener_message = listener.then((transimission: any) => {
        return Resolution.extract_Argument(transimission.Talk);
    });

    return expect(listener_message).resolves.toStrictEqual(message)

});


test("App.SampleControllerEventsClass listen/talk", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    //listener_instance.set_SampleController();
    //talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    const talker = talker_instance.announce_ClassReady();

    const listener_talk = listener.then((transimission: any) => {
        return transimission.Talk;
    });

    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady)

});

test("App.SampleControllerEventsClass set_ControllerEvents", () => {

    Controller.flush_GlobalController();

    const message: string = "this is the message";
    const channel: t_namespace = C_Controller.AllServices;
    const listener_namespace: t_namespace = "listener/namespace";
    const talker_namespace: t_namespace = "talker2/namespace";

    const listener_instance = new SampleControllerEventsClass(listener_namespace, channel, false);
    const talker_instance = new SampleControllerEventsClass(talker_namespace, channel, false);

    //listener_instance.set_SampleController();
    //talker_instance.set_SampleController();

    const listener = listener_instance.listen();
    //const talker = talker_instance.set_ControllerEvents();

    const listener_talk = listener.then((transimission: any) => {
        return transimission.Talk;
    });

    return expect(listener_talk).resolves.toStrictEqual(C_BootState.ClassReady)

});

test("App_Controller.ns", () => {

    Controller.flush_GlobalController();

    const manager = new SampleControllerEventsClass("App", undefined);
    const sequence = manager.manage_BootUp();

    const child1 = new SampleControllerEventsClass("App/Child1", undefined);
    const child2 = new SampleControllerEventsClass("App/Child2", undefined);
    const child3 = new SampleControllerEventsClass("App/Child3", undefined);
    const child4 = new SampleControllerEventsClass("App/Child4", undefined);

    //const sequence = new Promise((resolve) => {
    //    setTimeout(() => {
    //        resolve(manager.manage_BootUp());
    //    }, 100);
    //});

    //setTimeout(() => {
    //    child1.announce_ListenReady();
    //}, 200)
    //console.log(Controller.get_GlobalNamespaces())

    return expect(sequence).resolves.toStrictEqual([
        C_BootState.ClassReady,
        C_BootState.ListenReady
    ]);

});



//test("App_Controller", () => {

//    Controller.flush_GlobalController();

//    const manager = new SampleControllerEventsClass("App", undefined, false);
//    const child1 = new SampleControllerEventsClass("App/Child1", undefined, false);
//    const child2 = new SampleControllerEventsClass("App/Child2", undefined, false);
//    const child3 = new SampleControllerEventsClass("App/Child3", undefined, false);
//    const child4 = new SampleControllerEventsClass("App/Child4", undefined, false);

//    //const sequence = new Promise((resolve) => {
//    //    setTimeout(() => {
//    //        resolve(manager.manage_BootUp());
//    //    }, 100);
//    //});

//    const sequence = manager.manage_BootUp();
//    //setTimeout(() => {
//    //    child1.announce_ListenReady();
//    //}, 200)
//    //console.log(Controller.get_GlobalNamespaces())

//    return expect(sequence).resolves.toStrictEqual([
//        C_BootState.ClassReady,
//        C_BootState.ListenReady
//    ]);

//});
