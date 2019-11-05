import "@utkusarioglu/object-assist";
import { t_resolutionInstruction, t_resolutionInstructionNoArgs } from "@utkusarioglu/resolver";
import { t_serviceId, t_waitSet, t_transmission, e_ServiceGroup, e_Scope, t_singleScope, t_namespace, t_epoch } from "./t_controller";
export declare class BaseController {
    private _monologue_emitter;
    private _dialogue_emitter;
    private _announcement_archive;
    private _dialogue_archive;
    private _controller_scope;
    constructor(controller_scope: t_singleScope);
    request(scope: e_Scope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, group: e_ServiceGroup): Promise<any>;
    respond(responder_namespace: t_namespace, response_callback: (transmission: t_transmission) => Promise<any>, group: e_ServiceGroup, scope: e_Scope): void;
    private archive_Dialogue;
    static create_RandomServiceId(): t_serviceId;
    get_DialogueArchive(): object[];
    get_ServedChannels(): (string | symbol)[];
    announce(scope: t_singleScope, sender_namespace: t_namespace, recipient_namespace: t_namespace, talk: t_resolutionInstruction, delay?: boolean | t_epoch): void;
    get_AnnouncementArchive(): object[];
    private archive_Announcement;
    subscribe(scope: t_singleScope, subcribed_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, callback: (transmission: t_transmission) => void): void;
    wait(scope: t_singleScope, sender_namespace: t_namespace, recipient_namespace: t_namespace, listen: t_resolutionInstructionNoArgs, test_callback?: (transmission: t_transmission) => boolean, action_callback?: (transmission: t_transmission) => void, total_count?: number, current_count?: number): Promise<any>;
    wait_Some(scope: t_singleScope, sender_namespace: t_namespace, wait_set: t_waitSet[]): Promise<t_transmission[]>;
}
