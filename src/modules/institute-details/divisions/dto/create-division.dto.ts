import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { DIVISION_VALIDARION } from '../constants/divisions-validation.constant';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';
import { DivisionSubject } from '../enum/division-subject.enum';

export class CreateDivisionDto {
  @ApiProperty({
    description: "division's name",
    example: 'heros',
    isArray: false,
    maxLength: DIVISION_VALIDARION.NAME.MAX_LENGTH,
    minLength: DIVISION_VALIDARION.NAME.MIN_LENGTH,
    name: 'name',
    required: true,
    type: String,
  })
  @MaxLength(DIVISION_VALIDARION.NAME.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: DIVISION_VALIDARION.NAME.MAX_LENGTH,
    }),
  })
  @MinLength(DIVISION_VALIDARION.NAME.MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: DIVISION_VALIDARION.NAME.MIN_LENGTH,
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
    description: "division's logo",
    example: 'https...',
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

  @ApiProperty({
    description: 'نوع الشعبة هل هي قرآن ام علوم شرعية الخ',
    example: '1',
    isArray: false,
    maxLength: GLOBAL_VALIDATION.URL.MAX_LENGTH,
    minLength: GLOBAL_VALIDATION.URL.MIN_LENGTH,
    name: 'DivisionSubject',
    required: false,
    enum: DivisionSubject,
    type: Number,
  })
  @IsEnum(DivisionSubject)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: i18nValidationMessage<I18nTranslations>('validation.isNumber') },
  )
  @Transform((param) => +(param?.value ?? ''))
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  divisionType!: DivisionSubject;
}
