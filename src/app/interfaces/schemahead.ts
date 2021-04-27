import {Schemaitem} from '../interfaces/schema';
export interface Schemahead {
    id: number;
    name: string;
    description: string;
    imports?: string;
    fields?: string;
    security?: boolean;
    classsecurity?: string;
    filesecurity: string;
    mastersecurity?:boolean;
    filesupload?:boolean;
}

export interface Schemaheaditems extends Schemahead {
    schemastable: Schemaitem[];
}
