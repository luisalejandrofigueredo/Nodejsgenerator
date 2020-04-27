import {Schemaitem} from '../interfaces/schema';
export interface Schemahead {
    id: number;
    name: string;
    description: string;
}

export interface Schemaheadvector extends Schemahead {
    schemastable: Schemaitem[];
}
