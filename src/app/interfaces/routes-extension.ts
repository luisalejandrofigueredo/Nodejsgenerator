import { ControllersExtension } from "../interfaces/controllers-extension";
import {ServicesExtension  } from "../interfaces/services-extension";
export interface RoutesExtension {
    id:number,
    name:string,
    path:string,
    controllers:ControllersExtension[],
    service:ServicesExtension[]
}
