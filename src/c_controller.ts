import { t_controllerGenericObj } from "./t_controller";

export const C_Controller: t_controllerGenericObj = {

    /** Namespace to use when a controller wants to talk to all services */
    AllServices: "App",

    /** The duration that is allowed to pass between sequence events. can
     * be removed later on*/
    GraceTime: 20,

    E_AlreadyDefined: "Controller already defined",
    E_CalledBeforeDeclaration: "Controller called before declaration",
    E_NoScopeSelected: ["There is a problem with the scopes. ",
        "It may be due to undefiend LocalNamespace ",
        "if the code is expected to work in local scope"].join(''),
    E_MultipleRequestsBeforeResponse: "Multiple requests for the content was placed before the promise was resolved",
    E_ForcedDynamic: "All services are forced to be dynamic",
}
