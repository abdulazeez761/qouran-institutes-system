import { HydratedDocument } from 'mongoose';
import { Institute } from '../entities/institute.entity';

export type InstituteDocument = HydratedDocument<Institute>;
