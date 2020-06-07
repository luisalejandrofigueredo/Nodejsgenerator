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
}

export interface Schemaheaditems extends Schemahead {
    schemastable: Schemaitem[];
}
