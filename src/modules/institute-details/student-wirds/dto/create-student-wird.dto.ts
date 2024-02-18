import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { WirdType } from '../enum/wird-type.enum';
import { WirdStatus } from '../enum/wird-status.enum';
import { WirdResult } from '../enum/wird-result.enum';
import { WirdSurah } from '../enum/wird-surahs.enum';
import { WirdJuz } from '../enum/wird-juz.enum';
import { STUDETN_WIRD_VALIDATION } from '../constants/student-wirds-validation.constant';

export class CreateStudentWirdDto {
  @ApiProperty({
    description: "content of the student's wird",
    example: ' سورة البقرة من الصفحة 1 الى 5',
    isArray: false,
    maxLength: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MAX_LENGTH,
    minLength: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MIN_LNEGTH,
    name: 'wirdContent',
    required: true,
    type: String,
  })
  @MaxLength(STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MAX_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MAX_LENGTH,
    }),
  })
  @MinLength(STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MIN_LNEGTH, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: STUDETN_WIRD_VALIDATION.WIRD_CONTENT.MIN_LNEGTH,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @Transform((param) => (param.value ?? '').toLowerCase().trim())
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  wirdContent!: string;

  @ApiProperty({
    type: 'enum',
    description: ' 3 = نوع الورد هل هو مراجعة = 2 ام حفظ جديد =1 ام جززء واجب ',
    isArray: false,
    required: true,
    enum: WirdType,
    name: 'wirdType',
    example: WirdType.JUZ_WAJIB,
  })
  @IsEnum(WirdType)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  wirdType!: WirdType;

  @ApiProperty({
    type: 'enum',
    description: '2 = حالة الورد هل لا زال تحت التسميع = 1 ام تم تسميعه ',
    isArray: false,
    required: false,
    enum: WirdStatus,
    name: 'wirdStatus',
    example: WirdStatus.PENDING,
  })
  @IsEnum(WirdStatus)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  wirdStatus?: WirdStatus;

  @ApiProperty({
    type: 'enum',
    description: 'نتيجة تسميع الطالب ممتاز جدا ام ممتاز ام جيد جدا اما جيد ...',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'wirdResult',
    example: WirdResult.AA,
  })
  @IsEnum(WirdResult)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  wirdResult?: WirdResult;

  @ApiProperty({
    type: 'number',
    description: 'كم مرة رجع الطالب فيها كي يراجع ورده',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'timesOfReturning',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  timesOfReturning?: number;

  @ApiProperty({
    type: 'number',
    description: 'كم مرة رجع تردد فيها  الطالب اثناء تسميعه',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'timesOfHesitated',
    example: 3,
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  timesOfHesitated?: number;

  @ApiProperty({
    type: 'number',
    description: 'كم مرة رجع اخطأ فيها الطالب اثناء تسميعه',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'timesOfMistaks',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  timesOfMistaks?: number;

  @ApiProperty({
    type: 'string',
    description: 'السورة',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'wirdSurah',
    example: WirdSurah.Adh_Dhariyat,
  })
  @IsEnum(WirdSurah)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  wirdSurah?: WirdSurah;

  @ApiProperty({
    type: 'string',
    description: 'الجزء',
    isArray: false,
    required: false,
    enum: WirdResult,
    name: 'wirdSurah',
    example: WirdJuz.Juz_10,
  })
  @IsEnum(WirdJuz)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  wirdJuz?: WirdJuz;
}
