import { UserID } from '@decorators/user-id.decorator';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { ROUTES } from 'shared/constants/routes.constant';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureFormatValidationPipe } from './pipes/profile-picture-format-validation.pipe';
import { ProfilePictureSizeValidationPipe } from './pipes/profile-picture-size-validation.pipe';

@ApiTags(ROUTES.USERS.CONTROLLER)
@Controller(ROUTES.USERS.CONTROLLER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch(ROUTES.USERS.UPDATE_PROFILE)
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @UserID() userID: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ProfilePictureSizeValidationPipe(),
      new ProfilePictureFormatValidationPipe(),
    )
    profilePicture?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(
      userID,
      updateProfileDto,
      profilePicture,
    );
  }
}
