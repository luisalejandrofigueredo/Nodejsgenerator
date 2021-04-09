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
}
