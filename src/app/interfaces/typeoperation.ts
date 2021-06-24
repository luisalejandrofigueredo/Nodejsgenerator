export interface Typeoperation {
    idschema:number;
    id: number;
    type: string;
    operation: string;
    path: string;
    fields?: string[];
    field?: string;
    security: boolean;
    roles: string;
    extfiles?:string;
    options?:string;
    parameters:{name:string;type:string}[];
}
