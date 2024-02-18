import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateInstituteManagerDto } from './dto/update-institute-manager.dto';
import { Role } from '@shared/enums/role.enum';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { UserDocument } from '../users/types/user-document.type';
import { AdminsService } from '../admins/admins.service';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model, Types } from 'mongoose';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InstituteManagersService {
  constructor(
    @InjectModel(SCHEMAS.USER)
    private readonly instituteManagerModel: Model<User>,
    private readonly adminsSesrvice: AdminsService,
  ) {}

  async createInstitutemanagerForAuth(
    createAdminDto: CreateAdminDto,
    authorID: string,
  ): Promise<UserDocument> {
    const author = await this.adminsSesrvice.findAdminByID(authorID);

    if (!author)
      throw new HttpException(
        'what are you trying to do !-_-',
        HttpStatus.BAD_REQUEST,
      );

    const instituteMangaerToCreate = new this.instituteManagerModel(
      createAdminDto,
    );
    instituteMangaerToCreate.role = Role.ADMIN;
    instituteMangaerToCreate.instituteManagerProperties = {
      students: [],
      teachers: [],
      institutes: [],
      createdDivisions: [],
      author: author,
    };
    const createdInstituteManager = await instituteMangaerToCreate.save();

    author.adminProperties?.createdInstituteMamagers?.push(
      instituteMangaerToCreate._id as unknown as UserDocument,
    );
    await author.save();
    return createdInstituteManager;
  }

  async findInstituteManagerByID(
    instituteManagerID: string,
  ): Promise<UserDocument | null> {
    return await this.instituteManagerModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(instituteManagerID) },
        {
          role: Role.ADMIN,
        },
      ],
    });
  }
  async findInstituteManagerOrSuperAdminByID(
    instituteManagerID: string,
  ): Promise<UserDocument | null> {
    return await this.instituteManagerModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(instituteManagerID) },
        {
          $or: [{ role: Role.ADMIN }, { role: Role.SUPER_ADMIN }],
        },
      ],
    });
  }

  findAll() {
    return `This action returns all instituteManager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instituteManager`;
  }

  update(id: number, _updateInstituteManagerDto: UpdateInstituteManagerDto) {
    return `This action updates a #${id} instituteManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} instituteManager`;
  }
}
