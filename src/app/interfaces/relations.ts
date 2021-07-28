import {Onetoone} from '../interfaces/onetoone';
import { Onetomany } from './onetomany';
import {Manytoone} from '../interfaces/manytoone';
import {Manytomany} from '../interfaces/manytomany'
export interface Relations {
    OnetoOne: Onetoone[];
    Onetomany: Onetomany[];
    Manytoone: Manytoone[];
    Manytomany: Manytomany[];
}
