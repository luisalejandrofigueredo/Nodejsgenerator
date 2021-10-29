export interface Schemaitem {
    id: number;
    type: string;
    name: string;
    length: number;
    keyautonumber?: boolean;
    index?: boolean;
    indexParameter?:string;
    extraparameter?: string;
}
