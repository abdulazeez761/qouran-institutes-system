import { DivisionDocument } from '@modules/institute-details/divisions/types/division-document.type';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Types } from 'mongoose';
import { INSTITUTE_VALIDSTION } from '../constants/institutes-validation.constant';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';

@Schema({ timestamps: true })
export class Institute {
  @Prop({
    type: String,
    minlength: INSTITUTE_VALIDSTION.NAME.MIN_LENGTH,
    maxlength: INSTITUTE_VALIDSTION.NAME.MAX_LENGTH,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    maxlength: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    minlength: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    required: true,
  })
  logo!: string;

  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.USER,
    required: true,
  })
  author!: UserDocument;

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.DIVISION }],
    default: undefined,
  })
  divisions?: DivisionDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  instituteManagers?: UserDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  studets?: UserDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  teachers?: UserDocument[];
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
export const instituteMongooseModel: ModelDefinition = {
  name: SCHEMAS.INSTITUTE,
  schema: InstituteSchema,
};
