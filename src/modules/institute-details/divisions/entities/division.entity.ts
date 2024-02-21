import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Types } from 'mongoose';
import { DivisionSubject } from '../enum/division-subject.enum';
import { DIVISION_VALIDARION } from '../constants/divisions-validation.constant';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';
import { InstituteDocument } from '@modules/institute-details/institutes/types/institute-document.type';
import { DivisionStatus } from '../enum/division-status.enum';

@Schema({ timestamps: true })
export class Division {
  @Prop({
    type: String,
    minlength: DIVISION_VALIDARION.NAME.MIN_LENGTH,
    maxlength: DIVISION_VALIDARION.NAME.MAX_LENGTH,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.USER,
    required: true,
  })
  author!: UserDocument;

  @Prop({
    type: String,
    maxlength: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    minlength: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    required: true,
  })
  logo!: string;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.INSTITUTE,
    default: undefined,
  })
  institute?: InstituteDocument;

  @Prop({
    type: Number,
    enum: DivisionSubject,
    default: DivisionSubject.QURAN,
    required: true,
  })
  divisionSubject!: DivisionSubject;

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  teachers?: UserDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  students?: UserDocument[];

  @Prop({
    type: Number,
    enum: DivisionStatus,
    default: DivisionStatus.ACTIVE,
  })
  divisionStatus!: DivisionStatus;
}

const divisionSchema = SchemaFactory.createForClass(Division);

export const divisionMongooseModel: ModelDefinition = {
  name: SCHEMAS.DIVISION,
  schema: divisionSchema,
};
