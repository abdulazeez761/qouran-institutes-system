import { DivisionDocument } from '@modules/institute-details/divisions/types/division-document.type';
import { InstituteDocument } from '@modules/institute-details/institutes/types/institute-document.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Types } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class TeacherProperties {
  @Prop({
    type: Types.ObjectId,
    ref: SCHEMAS.INSTITUTE,
    required: true,
  })
  institute!: InstituteDocument;

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.DIVISION }],
    default: undefined,
  })
  divisions!: DivisionDocument[];
}

export const teacherPropertiesSchema =
  SchemaFactory.createForClass(TeacherProperties);
