import { CreateUserDto } from '@modules/system-users/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GLOBAL_VALIDATION } from '@shared/constants/validation-helpers.constant';
import { Transform } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

// extra teacher property
export class CreateTeacherDto extends CreateUserDto {
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
