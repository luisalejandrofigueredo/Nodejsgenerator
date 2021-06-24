export interface Api {
    id: number;
    type: string;
    operation: string;
    path: string;
    field: string;
    security: boolean;
    roles: string;
    extfiles: string;
    options: string;
    parameters: {name:string,type:string}[];
}
