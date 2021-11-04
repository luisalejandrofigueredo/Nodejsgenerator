import { ControllersExtension } from "../interfaces/controllers-extension";
export interface RoutesExtension {
    id:number,
    name:string,
    path:string,
    controllers:ControllersExtension[]
}
