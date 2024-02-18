import { HydratedDocument } from 'mongoose';
import { Division } from '../entities/division.entity';

export type DivisionDocument = HydratedDocument<Division>;
