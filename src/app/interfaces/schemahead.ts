import {Schemaitem} from '../interfaces/schema';
export interface Schemahead {
    id: number;
    name: string;
    description: string;
}

export interface Schemaheaditems extends Schemahead {
    schemastable: Schemaitem[];
}