import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Flag to indicate if the profile picture should be deleted',
    example: true,
    isArray: false,
    name: 'shouldDeleteProfilePicture',
    required: true,
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else {
      return false;
    }
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  shouldDeleteProfilePicture?: boolean;
}
