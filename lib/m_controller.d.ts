import { Controller } from "./controller";
import { M_Namespace } from "@utkusarioglu/namespace";
export interface M_Controller extends M_Namespace {
}
export declare abstract class M_Controller {
    private _controller;
    protected set_Controller(): void;
    protected get_Controller(): Controller;
}
