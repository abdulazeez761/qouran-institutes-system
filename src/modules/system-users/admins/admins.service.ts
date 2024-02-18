import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model, Types } from 'mongoose';
import { Role } from '@shared/enums/role.enum';
import { UserDocument } from '../users/types/user-document.type';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(SCHEMAS.USER) private readonly adminModel: Model<UserDocument>,
  ) {}
  async createSuperAdminForTheSystem(
    createAdminDto: CreateAdminDto,
    authorID: string,
  ): Promise<UserDocument> {
    const author = await this.findAdminByID(authorID);
    if (!author)
      throw new HttpException(
        'what are you trying to do !-_-',
        HttpStatus.BAD_REQUEST,
      );

    const createdAdmin = new this.adminModel(createAdminDto);
    createdAdmin.role = Role.SUPER_ADMIN;

    createdAdmin.adminProperties = {
      suspendedUsers: [],
      createdInstitutes: [],
      createdInstituteMamagers: [],
      author: author!,
    };
    return createdAdmin.save();
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} ${updateAdminDto} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
  async findAdminByID(admingID: string): Promise<UserDocument | null> {
    return this.adminModel
      .findOne<UserDocument>({
        $and: [
          { _id: new Types.ObjectId(admingID) },
          {
            $or: [{ role: Role.ADMIN }, { role: Role.SUPER_ADMIN }],
          },
        ],
      })
      .exec();
  }
  async findSuperAdmin(admingID: string): Promise<UserDocument | null> {
    return this.adminModel
      .findOne<UserDocument>({
        $and: [
          { _id: new Types.ObjectId(admingID) },
          { role: Role.SUPER_ADMIN },
        ],
      })
      .exec();
  }

  // async findInstituteAdmins(
  //   admingID: string,
  //   instituteAdmin: string,
  // ): Promise<UserDocument | null> {
  //   return this.adminModel
  //     .findOne<UserDocument>({
  //       $and: [
  //         { _id: new Types.ObjectId(admingID) },
  //         { role: Role.SUPER_ADMIN },
  //       ],
  //     })
  //     .exec();
  // }
}
