import { RoutesExtension  } from "../interfaces/routes-extension";
export interface Extension {
    id:number,
    name:string,
    description:string,
    routes:RoutesExtension[]
}
