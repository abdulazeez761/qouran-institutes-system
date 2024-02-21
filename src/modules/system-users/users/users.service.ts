import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMAS } from 'shared/constants/schemas.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './types/user-document.type';
import { Role } from '@shared/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SCHEMAS.USER) private readonly userModel: Model<User>,
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

  //  find user for admin and find all users for admin
}
