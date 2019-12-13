
/* ////////////////////////////////////////////////////////////////////////////
 *
 *	IMPORTS
 *
 * ///////////////////////////////////////////////////////////////////////// */

/*
 *	LOCALS
 */
import { Controller } from "./controller";
import { SampleControllerClass, ActiveEmitter } from "../TestSupport/sample_controller_class"

/*
 *	CONSTANTS
 */
import { C_StartupTalk } from "../Common/c_controller";

/*
 *	DATATYPES
 */
import { e_Scope, i_talk, i_request, i_response } from "../Common/t_controller";
import { t_ri, Resolution, t_ri0 } from "@utkusarioglu/resolver";






/* ////////////////////////////////////////////////////////////////////////////
 *
 *	DOMESTICS
 *
 * ///////////////////////////////////////////////////////////////////////// */

// this would need to be declared only once in production, not in every module
Controller.set_EventEmitter(ActiveEmitter);




test("Single Controller.listen&talk.Global", () => {

    Controller.flush_GlobalController();

    const namespace = "namespace";
    const c = new Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";

    const listen = new Promise((resolve) => {
        c.subscribe<t_ri<[typeof data]>>(
            C_StartupTalk.send_Archive,
            (transmission) => {
                resolve((Resolution.extract_Argument(transmission.Talk)));
            },
            subscribed_namespace,
            //e_Scope.Global,
        );
    });

    c.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
    );

    return expect(listen).resolves.toBe(data);

});

test("Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();

    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data: string = "data";

    const listen = new Promise((resolve) => {
        subscriber.subscribe(
            C_StartupTalk.send_Archive,
            (transmission: i_talk<t_ri0>) => {
                resolve((Resolution.extract_Argument(transmission.Talk)));
            },
            subscribed_namespace,
            //e_Scope.Global,
        );
    });

    announcer.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
    );

    return expect(listen).resolves.toBe(data);

});

test("Controller.listen&talk.Global.Count", () => {

    Controller.flush_GlobalController();

    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data: string = "data";

    const announcement_count: number = 10;

    const counter = new Promise((resolve) => {

        let counter: number = 0;
        let log: i_talk[] = [];

        subscriber.subscribe(
            C_StartupTalk.send_Archive,
            (transmission: i_talk<t_ri0>) => {
                log.push(transmission)
                counter++
            },
            subscribed_namespace,
            //e_Scope.Global,
        );

        setTimeout(() => resolve(counter), 1000)
    });

    for (let i = 0; i < announcement_count; i++) {
        announcer.announce(
            subscribed_namespace,
            [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
        );
    }

    return expect(counter).resolves.toBe(announcement_count);
});


test("Controller.wait&talk.Global.Count", () => {

    Controller.flush_GlobalController();

    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data: string = "data";

    const announcement_count: number = 1;

    const counter = new Promise((resolve) => {

        let counter: number = 0;
        let log: i_talk[] = [];

        subscriber.wait(
            subscribed_namespace,
            C_StartupTalk.send_Archive,
            undefined,
            (transmission: i_talk<t_ri0>) => {
                log.push(transmission)
                counter++
            },
            //e_Scope.Global,
        );

        setTimeout(() => resolve(counter), 1000)
    });

    announcer.announce(
        subscribed_namespace,
        [...C_StartupTalk.send_Archive, [data]] as t_ri<[typeof data]>,
    );

    return expect(counter).resolves.toBe(announcement_count);
});


test("Controller.service.global", () => {
    Controller.flush_GlobalController();

    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new Controller(service_namespace);
    const response_data = "response_data";

    service_controller.respond<t_ri<[string]>,string>(
        (transmission) => {
            return Promise.resolve(response_data);
        },
        //false,
        //e_Scope.Global,
    );

    const response = consuming_controller.request<string>(
        service_namespace,
        ["RI", "do_Something"],
        //e_Scope.Global,
    ).
        then((transmission: i_response<string>) => {
            return transmission.Content;
        });

    return expect(response).resolves.toStrictEqual(response_data);

});


test("Controller.wait.global.noTest", () => {
    Controller.flush_GlobalController();

    const consuming_namespace = "namespace/consuming";
    const waiting_controller = new Controller(consuming_namespace);
    const talking_namespace = "service/namespace";
    const talking_controller = new Controller(talking_namespace);
    const response_data = "response_data";
    const talk_ri: t_ri0 = ["RI", "wait_over"];

    const wait = waiting_controller.wait(
        talking_namespace,
        talk_ri,
        undefined,
        (t) => t.Talk
    );

    talking_controller.announce(
        talking_namespace,
        talk_ri,
    )

    return expect(wait).resolves.toStrictEqual(talk_ri);

});

test("Controller.wait.global.test", () => {

    Controller.flush_GlobalController();

    const consuming_namespace = "namespace/consuming";
    const waiting_controller = new Controller(consuming_namespace);
    const talking_namespace = "service/namespace";
    const talking_controller = new Controller(talking_namespace);
    const response_data = "response_data";

    const talk_ri: t_ri0 = ["RI", "wait_over"];
    const talk_ri2: t_ri0 = ["RI", "wait_not_over"];

    let wait_over_counter: number = 0;

    const wait = waiting_controller.wait(
        talking_namespace,
        talk_ri,
        (t) => {
            wait_over_counter += t.Talk === talk_ri ? 1 : 0
            return wait_over_counter === 3;
        },
        (t) => wait_over_counter
    );

    talking_controller.announce(
        talking_namespace,
        talk_ri,
    )

            for (let i = 0; i < 100; i++) {
                talking_controller.announce(
                    talking_namespace,
                    talk_ri2,
                )
            }

    talking_controller.announce(
        talking_namespace,
        talk_ri,
    )

            for (let i = 0; i < 100; i++) {
                talking_controller.announce(
                    talking_namespace,
                    talk_ri2,
                )
            }

    talking_controller.announce(
        talking_namespace,
        talk_ri,
    )

    expect(talking_controller.get_AnnouncementArchive().length).toStrictEqual(203)
    return expect(wait).resolves.toStrictEqual(3);

});