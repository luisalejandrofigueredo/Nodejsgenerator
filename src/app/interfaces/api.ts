export interface Api {
    id: number;
    type: string;
    operation: string;
    path: string;
    field: string;
    security: boolean;
    roles: string;
    extfiles:string;
}
