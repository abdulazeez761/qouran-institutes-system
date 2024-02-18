import { InstituteDocument } from '@modules/institute-details/institutes/types/institute-document.type';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SCHEMAS } from 'shared/constants/schemas.constant';

@Schema({ _id: false, timestamps: false })
export class AdminProperties {
  @Prop({ type: Types.ObjectId, ref: SCHEMAS.USER, required: true })
  author!: UserDocument;

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.INSTITUTE }],
    default: undefined,
  })
  createdInstitutes?: InstituteDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  createdInstituteMamagers?: UserDocument[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: SCHEMAS.USER }],
    default: undefined,
  })
  suspendedUsers?: UserDocument[];
}

export const adminPropertiesSchema =
  SchemaFactory.createForClass(AdminProperties);
