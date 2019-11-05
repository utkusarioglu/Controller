import "@utkusarioglu/object-assist";
import { EventEmitter } from "events";
import { Resolution } from "@utkusarioglu/resolver";
import { C_Controller } from "./c_controller";
export class BaseController {
    constructor(controller_scope) {
        this._monologue_emitter = new EventEmitter().setMaxListeners(20);
        this._dialogue_emitter = new EventEmitter().setMaxListeners(20);
        this._announcement_archive = [];
        this._dialogue_archive = [];
        this._controller_scope = controller_scope;
    }
    request(scope, sender_namespace, recipient_namespace, talk, group) {
        const service_id = BaseController.create_RandomServiceId();
        const request_channel = recipient_namespace +
            C_Controller.DIALOGUE_SEPARATOR +
            group;
        const response_channel = request_channel +
            C_Controller.ID_SEPARATOR +
            service_id;
        const request_packet = {
            Channel: response_channel,
            Sender: sender_namespace,
            Recipient: recipient_namespace,
            Talk: talk,
            Id: service_id,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };
        return new Promise((resolve, reject) => {
            this._dialogue_emitter
                .once((response_channel), (response_packet) => {
                response_packet.sniff("Error", resolve.bind(null, response_packet), reject.bind(null, response_packet));
                this.archive_Dialogue(request_packet, response_packet);
            });
            this._dialogue_emitter.emit(request_channel, request_packet);
        });
    }
    respond(responder_namespace, response_callback, group, scope) {
        const listen_channel = responder_namespace +
            C_Controller.DIALOGUE_SEPARATOR +
            group;
        this._dialogue_emitter.on(listen_channel, (transmission) => {
            response_callback(transmission)
                .then((requested_return_content) => {
                const serve_packet = {
                    Sender: transmission.Recipient,
                    Recipient: transmission.Sender,
                    Talk: transmission.Talk,
                    Content: requested_return_content,
                    Time: (new Date()).getTime(),
                    Static: false,
                    Scope: scope,
                };
                this._dialogue_emitter
                    .emit(transmission.Channel, serve_packet);
            })
                .catch((error) => {
                console.log("serve error:", error);
            });
        });
    }
    archive_Dialogue(request_packet, response_packet) {
        this._dialogue_archive.push({
            Meta: {
                Elapsed: (new Date()).getTime() - request_packet.Time,
                State: response_packet.hasOwnProperty("Error")
                    ? "Fail"
                    : "Success",
            },
            Request: request_packet,
            Response: response_packet,
        });
    }
    static create_RandomServiceId() {
        return Math.random().toString().slice(2);
    }
    get_DialogueArchive() {
        return this._dialogue_archive;
    }
    ;
    get_ServedChannels() {
        return this._dialogue_emitter.eventNames();
    }
    announce(scope, sender_namespace, recipient_namespace, talk, delay = false) {
        const expression_trail = Resolution.extract_ExpressionTrail_FromResolutionInstruction(talk);
        const announcement_channel = recipient_namespace +
            C_Controller.MONOLOGUE_SEPARATOR +
            expression_trail;
        const announcement_packet = {
            Channel: announcement_channel,
            Sender: sender_namespace,
            Recipient: recipient_namespace,
            Talk: talk,
            Time: (new Date()).getTime(),
            Static: false,
            Scope: scope,
        };
        const do_announcement = () => {
            this._monologue_emitter.emit(announcement_channel, announcement_packet);
            this.archive_Announcement(sender_namespace, announcement_channel, announcement_packet);
        };
        if (delay) {
            if (delay === true) {
                delay = C_Controller.GraceTime;
            }
            setTimeout(do_announcement, delay);
        }
        else {
            do_announcement();
        }
    }
    get_AnnouncementArchive() {
        return this._announcement_archive;
    }
    archive_Announcement(sender_namespace, announcement_channel, announcement_packet = null) {
        this._announcement_archive.push({
            Namespace: sender_namespace,
            Channel: announcement_channel,
            Content: announcement_packet,
            Time: (new Date()).getTime(),
        });
    }
    subscribe(scope, subcribed_namespace, listen, callback) {
        const expression_trail = Resolution.extract_ExpressionTrail_FromResolutionInstruction(listen);
        const channel = subcribed_namespace +
            C_Controller.MONOLOGUE_SEPARATOR +
            expression_trail;
        this._monologue_emitter.on(channel, callback);
    }
    wait(scope, sender_namespace, recipient_namespace, listen, test_callback = () => true, action_callback = () => { }, total_count = 1, current_count = total_count) {
        return new Promise((resolve, reject) => {
            const once_callback_function = (transmission) => {
                if (test_callback(transmission)) {
                    current_count--;
                    resolve(action_callback(transmission));
                }
                else {
                    return this
                        .wait(scope, sender_namespace, recipient_namespace, listen, test_callback, action_callback, total_count, current_count);
                }
            };
            if (current_count > 0) {
                const expression_trail = Resolution.extract_ExpressionTrail_FromResolutionInstruction(listen);
                const channel = recipient_namespace +
                    C_Controller.MONOLOGUE_SEPARATOR +
                    expression_trail;
                return this._monologue_emitter.once(channel, once_callback_function);
            }
        })
            .catch((error_content) => {
            console.error("BaseController.wait.Promise.catch:\n", error_content);
        });
    }
    wait_Some(scope, sender_namespace, wait_set) {
        return Promise.all(wait_set.map((wait_event) => {
            return this.wait(scope, sender_namespace, wait_event.Namespace, wait_event.Listen, wait_event.Test, wait_event.Call);
        }));
    }
}
//# sourceMappingURL=base_controller.js.map