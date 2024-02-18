import { DivisionDocument } from '@modules/institute-details/divisions/types/division-document.type';
import { InstituteDocument } from '@modules/institute-details/institutes/types/institute-document.type';

import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Types } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class InstituteManagerProperties {
  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.INSTITUTE }],
  })
  institutes!: InstituteDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.DIVISION }],
  })
  createdDivisions!: DivisionDocument[];

  @Prop({ type: Types.ObjectId, ref: SCHEMAS.USER, required: true })
  author!: UserDocument;

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
}

export const instituteManagerPropertiesSchema = SchemaFactory.createForClass(
  InstituteManagerProperties,
);
