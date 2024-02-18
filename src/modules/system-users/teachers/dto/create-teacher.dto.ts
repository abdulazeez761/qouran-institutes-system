import { IsContainsLowercase } from '@decorators/is-contains-lower-case.decorator';
import { MatchTwoProperties } from '@decorators/match-two-properties.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';
import { Transform } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

// extra teacher property
export class CreateTeacherDto {
  @ApiProperty({
    description: "sheikh's email",
    example: 'Abdulaziz@gmail.com',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.EMAIL.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.EMAIL.MIN_LENGTH,
    name: 'email',
    required: true,
    type: String,
  })
  @MaxLength(GLOBAL_VALIDATION.EMAIL.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: GLOBAL_VALIDATION.EMAIL.MAX_LENGTH,
    }),
  })
  @MinLength(GLOBAL_VALIDATION.EMAIL.MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: GLOBAL_VALIDATION.EMAIL.MIN_LENGTH,
    }),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.email'),
  })
  @Transform((param) => (param.value ?? '').toLowerCase().trim())
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  email!: string;

  @ApiProperty({
    description: "teachers's password",
    example: 'Abd.!23423',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.PASSWORD.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.PASSWORD.MIN_LENGTH,
    name: 'password',
    required: true,
    type: String,
  })
  @MaxLength(GLOBAL_VALIDATION.PASSWORD.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: GLOBAL_VALIDATION.PASSWORD.MAX_LENGTH,
    }),
  })
  @MinLength(GLOBAL_VALIDATION.PASSWORD.MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: GLOBAL_VALIDATION.PASSWORD.MIN_LENGTH,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsContainsLowercase({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.passwordContains.lowercase',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  password!: string;

  @ApiProperty({
    description: "User's confirm password",
    example: 'Abd.!23423',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.PASSWORD.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.PASSWORD.MIN_LENGTH,
    name: 'confirmPassword',
    required: true,
    type: String,
  })
  @MatchTwoProperties('password')
  confirmPassword!: string;

  @ApiProperty({
    description: "teacher's profile",
    example: 'http/photo',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    name: 'profilePhoto',
    required: true,
    type: String,
  })
  @MaxLength(GLOBAL_VALIDATION.URL.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    }),
  })
  @MinLength(GLOBAL_VALIDATION.URL.MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    }),
  })
  @Transform((param) => (param.value ?? '').toLowerCase().trim())
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  profilePhoto?: string;
}
