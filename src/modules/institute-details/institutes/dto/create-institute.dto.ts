import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { INSTITUTE_VALIDSTION } from '../constants/institutes-validation.constant';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';

export class CreateInstituteDto {
  @ApiProperty({
    description: "institute's name",
    example: 'mut1aq',
    isArray: false,
    maxLength: INSTITUTE_VALIDSTION.NAME.MAX_LENGTH,
    minLength: INSTITUTE_VALIDSTION.NAME.MIN_LENGTH,
    name: 'name',
    required: true,
    type: String,
  })
  @MaxLength(INSTITUTE_VALIDSTION.NAME.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: INSTITUTE_VALIDSTION.NAME.MAX_LENGTH,
    }),
  })
  @MinLength(INSTITUTE_VALIDSTION.NAME.MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: INSTITUTE_VALIDSTION.NAME.MIN_LENGTH,
    }),
  })
  @Transform((param) => (param?.value ?? '').trim())
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  name!: string;

  @ApiProperty({
    description: "institute's logo",
    example: 'mut1aq',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    name: 'logo',
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
  @Transform((param) => (param?.value ?? '').trim())
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  logo!: string;
}
