import { Controller } from "./controller";
import { ActiveEmitter } from "../TestSupport/sample_controller_class";
import { C_StartupTalk } from "../Common/c_controller";
import { Resolution } from "@utkusarioglu/resolver";
Controller.set_EventEmitter(ActiveEmitter);
test("Single Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();
    const namespace = "namespace";
    const c = new Controller(namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        c.subscribe(C_StartupTalk.send_Archive, (transmission) => {
            resolve((Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    c.announce([...C_StartupTalk.send_Archive, [data]], subscribed_namespace);
    return expect(listen).resolves.toBe(data);
});
test("Controller.listen&talk.Global", () => {
    Controller.flush_GlobalController();
    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const listen = new Promise((resolve) => {
        subscriber.subscribe(C_StartupTalk.send_Archive, (transmission) => {
            resolve((Resolution.extract_Argument(transmission.Talk)));
        }, subscribed_namespace);
    });
    announcer.announce([...C_StartupTalk.send_Archive, [data]], subscribed_namespace);
    return expect(listen).resolves.toBe(data);
});
test("Controller.listen&talk.Global.Count", () => {
    Controller.flush_GlobalController();
    const subscriber_namespace = "subscriber/namespace";
    const announcer_namespace = "announcer/namespace";
    const subscriber = new Controller(subscriber_namespace);
    const announcer = new Controller(announcer_namespace);
    const subscribed_namespace = "subscribed/namespace";
    const data = "data";
    const announcement_count = 10;
    const counter = new Promise((resolve) => {
        let counter = 0;
        let log = [];
        subscriber.subscribe(C_StartupTalk.send_Archive, (transmission) => {
            log.push(transmission);
            counter++;
        }, subscribed_namespace);
        setTimeout(() => resolve(counter), 1000);
    });
    for (let i = 0; i < announcement_count; i++) {
        announcer.announce([...C_StartupTalk.send_Archive, [data]], subscribed_namespace);
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
    const data = "data";
    const announcement_count = 1;
    const counter = new Promise((resolve) => {
        let counter = 0;
        let log = [];
        subscriber.wait(C_StartupTalk.send_Archive, subscribed_namespace, undefined, (transmission) => {
            log.push(transmission);
            counter++;
        });
        setTimeout(() => resolve(counter), 1000);
    });
    announcer.announce([...C_StartupTalk.send_Archive, [data]], subscribed_namespace);
    return expect(counter).resolves.toBe(announcement_count);
});
test("Controller.service.global", () => {
    Controller.flush_GlobalController();
    const consuming_namespace = "namespace/consuming";
    const consuming_controller = new Controller(consuming_namespace);
    const service_namespace = "service/namespace";
    const service_controller = new Controller(service_namespace);
    const response_data = "response_data";
    service_controller.respond((transmission) => {
        return Promise.resolve(response_data);
    });
    const response = consuming_controller.request(["RI", "do_Something"], service_namespace).
        then((transmission) => {
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
    const talk_ri = ["RI", "wait_over"];
    const wait = waiting_controller.wait(talk_ri, talking_namespace, undefined, (t) => t.Talk);
    talking_controller.announce(talk_ri, talking_namespace);
    return expect(wait).resolves.toStrictEqual(talk_ri);
});
test("Controller.wait.global.test", () => {
    Controller.flush_GlobalController();
    const consuming_namespace = "namespace/consuming";
    const waiting_controller = new Controller(consuming_namespace);
    const talking_namespace = "service/namespace";
    const talking_controller = new Controller(talking_namespace);
    const response_data = "response_data";
    const talk_ri = ["RI", "wait_over"];
    const talk_ri2 = ["RI", "wait_not_over"];
    let wait_over_counter = 0;
    const wait = waiting_controller.wait(talk_ri, talking_namespace, (t) => {
        wait_over_counter += t.Talk === talk_ri ? 1 : 0;
        return wait_over_counter === 3;
    }, (t) => wait_over_counter);
    talking_controller.announce(talk_ri, talking_namespace);
    for (let i = 0; i < 100; i++) {
        talking_controller.announce(talk_ri2, talking_namespace);
    }
    talking_controller.announce(talk_ri, talking_namespace);
    for (let i = 0; i < 100; i++) {
        talking_controller.announce(talk_ri2, talking_namespace);
    }
    talking_controller.announce(talk_ri, talking_namespace);
    expect(talking_controller.get_AnnouncementArchive().length).toStrictEqual(203);
    return expect(wait).resolves.toStrictEqual(3);
});
//# sourceMappingURL=controller.test.js.map