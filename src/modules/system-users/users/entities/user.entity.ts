import { instituteManagerPropertiesSchema } from './../../institute-managers/entities/institute-manager.entity';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '@shared/enums/role.enum';
import { SCHEMAS } from 'shared/constants/schemas.constant';
import { AccountStatus } from '../enums/account-status.enum';
import {
  AdminProperties,
  adminPropertiesSchema,
} from '@modules/system-users/admins/entities/admin.entity';
import {
  TeacherProperties,
  teacherPropertiesSchema,
} from '@modules/system-users/teachers/entities/teacher.entity';
import {
  StudentProperties,
  studentPropertiesSchema,
} from '@modules/system-users/students/entities/student.entity';

import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';
import { InstituteManagerProperties } from '@modules/system-users/institute-managers/entities/institute-manager.entity';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    minlength: GLOBAL_VALIDATION.EMAIL.MIN_LENGTH,
    maxlength: GLOBAL_VALIDATION.EMAIL.MAX_LENGTH,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({
    type: String,
    minlength: GLOBAL_VALIDATION.USER_NAME.MIN_LENGTH,
    maxlength: GLOBAL_VALIDATION.USER_NAME.MAX_LENGTH,
    required: true,
    unique: true,
  })
  username!: string;

  @Prop({
    type: String,
    minlength: GLOBAL_VALIDATION.FIRST_NAME.MIN_LENGTH,
    maxlength: GLOBAL_VALIDATION.FIRST_NAME.MAX_LENGTH,
    required: true,
    unique: false,
    sparse: true,
  })
  firstName!: string;

  @Prop({
    type: String,
    minlength: GLOBAL_VALIDATION.LAST_NAME.MIN_LENGTH,
    maxlength: GLOBAL_VALIDATION.LAST_NAME.MAX_LENGTH,
    required: true,
    unique: false,
    sparse: true,
  })
  lastName!: string;

  @Prop({
    type: String,
    minlength: GLOBAL_VALIDATION.PHONE_NUMBER.MIN_LENGTH,
    maxlength: GLOBAL_VALIDATION.PHONE_NUMBER.MAX_LENGTH,
    required: true,
    unique: false,
    sparse: true,
  })
  phoneNumber!: string;

  @Prop({
    type: Number,
    enum: Role,
    required: true,
  })
  role!: Role;

  @Prop({
    type: Number,
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  accountStatus!: AccountStatus;

  @Prop({
    type: adminPropertiesSchema,
    default: undefined,
  })
  adminProperties?: AdminProperties;

  @Prop({
    type: instituteManagerPropertiesSchema,
    default: undefined,
  })
  instituteManagerProperties?: InstituteManagerProperties;

  @Prop({
    type: teacherPropertiesSchema,
    default: undefined,
  })
  teacherProperties?: TeacherProperties;

  @Prop({
    type: studentPropertiesSchema,
    default: undefined,
  })
  studentProperties?: StudentProperties;
}

const UserSchema = SchemaFactory.createForClass(User);

export const userMongooseModel: ModelDefinition = {
  name: SCHEMAS.USER,
  schema: UserSchema,
};
