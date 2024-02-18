import { WirdType } from './../enum/wird-type.enum';
import { WirdResult } from './../enum/wird-result.enum';
import { DivisionDocument } from '@modules/institute-details/divisions/types/division-document.type';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Types } from 'mongoose';
import { WirdStatus } from '../enum/wird-status.enum';
import { InstituteDocument } from '@modules/institute-details/institutes/types/institute-document.type';
import { WirdSurah } from '../enum/wird-surahs.enum';
import { WirdJuz } from '../enum/wird-juz.enum';
import { STUDETN_WIRD_VALIDATION } from '../constants/student-wirds-validation.constant';

@Schema({ timestamps: true })
export class Wird {
  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.USER,
  })
  student!: UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.USER,
  })
  teacher!: UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.DIVISION,
  })
  division!: DivisionDocument;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.INSTITUTE,
  })
  institute!: InstituteDocument;

  @Prop({
    type: String,
    minlength: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MIN_LNEGTH,
    maxlength: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MAX_LENGTH,
    required: true,
  })
  wirdContent!: string;

  @Prop({
    type: Number,
    enum: WirdType,
    required: true,
  })
  wirdType!: WirdType;

  @Prop({
    type: Number,
    enum: WirdStatus,
    default: WirdStatus.PENDING,
    required: false,
  })
  wirdStatus?: WirdStatus;

  @Prop({
    type: Number,
    enum: WirdResult,
    default: undefined,
    required: false,
  })
  wirdResult?: WirdResult;

  @Prop({
    type: String,
    enum: WirdSurah,
    default: undefined,
    required: false,
  })
  wirdSurah?: WirdSurah;

  @Prop({
    type: String,
    enum: WirdJuz,
    default: undefined,
    required: false,
  })
  wirdJuz?: WirdJuz;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: false,
  })
  timesOfReturning?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: undefined,
    required: false,
  })
  timesOfHesitated?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: undefined,
    required: false,
  })
  timesOfMistaks?: number;
}

const wirdSchema = SchemaFactory.createForClass(Wird);

export const divisionMongooseModel: ModelDefinition = {
  name: SCHEMAS.WIRD,
  schema: wirdSchema,
};
