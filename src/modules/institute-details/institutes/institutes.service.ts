import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model } from 'mongoose';
import { InstituteDocument } from './types/institute-document.type';
import { AdminsService } from '@modules/system-users/admins/admins.service';
import { ResponseFromServiceI } from '@shared/interfaces/general/response-from-service.interface';
import { InstituteManagersService } from '@modules/system-users/institute-managers/institute-managers.service';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { Role } from '@shared/enums/role.enum';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectModel(SCHEMAS.INSTITUTE)
    private readonly instituteModel: Model<InstituteDocument>,
    private readonly adminService: AdminsService,
    private readonly instituteManagersService: InstituteManagersService,
  ) {}
  async create(
    createInstituteDto: CreateInstituteDto,
    superAminID: string,
  ): Promise<ResponseFromServiceI<InstituteDocument>> {
    const superAdmin = await this.adminService.findSuperAdmin(superAminID);
    if (!superAdmin)
      throw new HttpException(
        'what are you trying to do !-_-',
        HttpStatus.BAD_REQUEST,
      );

    const instituteToCreate = new this.instituteModel(createInstituteDto);
    instituteToCreate.author = superAdmin;
    instituteToCreate.instituteManagers = [];
    instituteToCreate.divisions = [];
    instituteToCreate.studets = [];
    instituteToCreate.teachers = [];
    const createdInstitute = await instituteToCreate.save();

    superAdmin.adminProperties?.createdInstitutes?.push(
      instituteToCreate._id as unknown as InstituteDocument,
    );
    await superAdmin.save();

    return {
      data: createdInstitute.toJSON({
        flattenObjectIds: true,
        depopulate: true,
      }),
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.institute' },
      },
    };
  }

  async findAll(): Promise<ResponseFromServiceI<InstituteDocument[]>> {
    const institutes = await this.instituteModel.find().exec();

    return {
      data: institutes,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.institute' },
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} institute`;
  }

  update(id: number, updateInstituteDto: UpdateInstituteDto) {
    return `This action updates a #${id} ${updateInstituteDto} institute`;
  }

  remove(id: number) {
    return `This action removes a #${id} institute`;
  }

  async findInstituteByID(
    instituteID: string,
  ): Promise<InstituteDocument | null> {
    return this.instituteModel.findById<InstituteDocument>(instituteID).exec();
  }

  async addInstituteManager(
    institutesID: string,
    instituteMangerID: string,
    adminID: string,
  ) {
    const [institute, instituteManagerToAdd, admin] = await Promise.all([
      this.findInstituteByID(institutesID),
      this.instituteManagersService.findInstituteManagerByID(instituteMangerID),
      this.instituteManagersService.findInstituteManagerOrSuperAdminByID(
        adminID,
      ),
    ]);

    if (
      !admin ||
      (admin.role !== Role.SUPER_ADMIN &&
        !institute?.instituteManagers?.includes(
          admin._id as unknown as UserDocument,
        ))
    )
      throw new HttpException(
        'what are you traing to do! -_-',
        HttpStatus.NOT_FOUND,
      );

    if (!institute)
      throw new HttpException("institute Doesn't exist", HttpStatus.NOT_FOUND);

    if (!instituteManagerToAdd)
      throw new HttpException(
        "isntitute manager Doesn't exist",
        HttpStatus.NOT_FOUND,
      );

    if (
      institute.instituteManagers?.includes(
        instituteManagerToAdd._id as unknown as UserDocument,
      ) ||
      instituteManagerToAdd.instituteManagerProperties?.institutes?.includes(
        institute._id as unknown as InstituteDocument,
      )
    )
      throw new HttpException(
        'isntitute manager Alrady exist',
        HttpStatus.BAD_REQUEST,
      );

    institute.instituteManagers?.push(
      instituteManagerToAdd._id as unknown as UserDocument,
    );
    instituteManagerToAdd.instituteManagerProperties?.institutes?.push(
      institute as unknown as InstituteDocument,
    );
    const [updatedInstitute] = await Promise.all([
      institute.save(),
      instituteManagerToAdd.save(),
    ]);

    return {
      data: updatedInstitute.toObject({
        flattenObjectIds: true,
        depopulate: true,
      }),
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.institute' },
      },
    };
  }
}
