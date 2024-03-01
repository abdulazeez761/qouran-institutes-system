import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMAS } from 'shared/constants/schemas.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './types/user-document.type';
import { Role } from '@shared/enums/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileUploadService } from '@lib/file-upload/file-upload.service';
import { checkObjectNullability } from 'shared/util/nullability.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SCHEMAS.USER) private readonly userModel: Model<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  createUserForAuth(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);

    createdUser.role = Role.TEACHER;
    return createdUser.save();
  }

  findUserByEmail(credentials: string) {
    return this.userModel
      .findOne<UserDocument>({
        $or: [
          {
            email: credentials,
          },
          {
            username: credentials,
          },
        ],
      })
      .exec();
  }

  findByID(userID: string): Promise<UserDocument | null> {
    return this.userModel.findById<UserDocument>(userID).exec();
  }

  async updateProfile(
    userID: string,
    updateProfileDto: UpdateProfileDto,
    profilePicture?: Express.Multer.File,
  ) {
    const user = await this.findByID(userID);
    if (!user)
      throw new HttpException(
        'User was not found can not make an update',
        HttpStatus.NOT_FOUND,
      );

    const shouldAddProfilePictureToUserWithNoProfilePicture =
      !checkObjectNullability(user.profilePicture) &&
      checkObjectNullability(profilePicture);
    const shouldDeleteProfilePictureAndAddNewProfilePicture =
      checkObjectNullability(user.profilePicture) &&
      checkObjectNullability(profilePicture);

    const shouldDeleteProfilePicture =
      updateProfileDto.shouldDeleteProfilePicture &&
      checkObjectNullability(user.profilePicture);

    if (shouldAddProfilePictureToUserWithNoProfilePicture) {
      const profilePictureMediaObject =
        await this.fileUploadService.uploadProfilePicture(
          profilePicture!,
          user.id,
        );

      user.profilePicture = profilePictureMediaObject;
    } else if (shouldDeleteProfilePictureAndAddNewProfilePicture) {
      const [profilePictureMediaObject, _] = await Promise.all([
        this.fileUploadService.uploadProfilePicture(profilePicture!, user.id),
        this.fileUploadService.deleteResource(user.profilePicture!.solutionID),
      ]);

      user.profilePicture = profilePictureMediaObject;
    } else if (shouldDeleteProfilePicture) {
      await this.fileUploadService.deleteResource(
        user.profilePicture!.solutionID,
      );

      user.profilePicture = undefined;
    }
    await user.save();

    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
      data: user,
    };
  }

  //  find user for admin and find all users for admin
}
