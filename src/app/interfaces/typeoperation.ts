export interface Typeoperation {
    id: number;
    type: string;
    operation: string;
    path: string;
    fields?: string[];
    field?: string;
    security: boolean;
    roles: string;
}
