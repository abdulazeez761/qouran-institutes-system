import { InstituteStatus } from './enum/institute-status.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model, Types } from 'mongoose';
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

  async findOne(
    instituteID: string,
  ): Promise<ResponseFromServiceI<InstituteDocument>> {
    const institute = await this.findActiveInstituteByID(instituteID);
    if (!institute)
      throw new HttpException(
        'institute does not exist!',
        HttpStatus.NOT_FOUND,
      );

    return {
      data: institute,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.institute' },
      },
    };
  }

  async update(
    updateInstituteDto: UpdateInstituteDto,
    instituteID: string,
    instituteManagerID: string,
  ): Promise<ResponseFromServiceI<InstituteDocument>> {
    const [isntituteManager, institute] = await Promise.all([
      this.instituteManagersService.findInstituteManagerOrSuperAdminByID(
        instituteManagerID,
      ),
      this.findActiveInstituteByID(instituteID),
    ]);
    if (!isntituteManager)
      throw new HttpException(
        'you are not authorized for this action',
        HttpStatus.BAD_REQUEST,
      );
    if (!institute)
      throw new HttpException("institute Doesn't exist", HttpStatus.NOT_FOUND);
    await this.instituteModel
      .updateOne(
        { _id: new Types.ObjectId(instituteID) },
        { $set: { ...updateInstituteDto } },
      )
      .exec();

    return {
      data: institute,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.institute' },
      },
    };
  }

  async softDeleteInstitute(instituteID: string, instituteManagerID: string) {
    const [isntituteManager, institute] = await Promise.all([
      this.instituteManagersService.findInstituteManagerOrSuperAdminByID(
        instituteManagerID,
      ),
      this.findActiveInstituteByID(instituteID),
    ]);
    if (!isntituteManager)
      throw new HttpException(
        'you are not authorized for this action',
        HttpStatus.BAD_REQUEST,
      );
    if (!institute)
      throw new HttpException("institute Doesn't exist", HttpStatus.NOT_FOUND);
    await this.instituteModel
      .updateOne(
        { _id: new Types.ObjectId(instituteID) },
        { $set: { isntituteStatus: InstituteStatus.DELETED } },
      )
      .exec();
    return {
      data: institute,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.institute' },
      },
    };
  }

  async unDeletInsitiute(instituteID: string, instituteManagerID: string) {
    const [isntituteManager, institute] = await Promise.all([
      this.instituteManagersService.findInstituteManagerOrSuperAdminByID(
        instituteManagerID,
      ),
      this.findDeletedInstituteByID(instituteID),
    ]);
    if (!isntituteManager)
      throw new HttpException(
        'you are not authorized for this action',
        HttpStatus.BAD_REQUEST,
      );
    if (!institute)
      throw new HttpException("institute Doesn't exist", HttpStatus.NOT_FOUND);
    await this.instituteModel
      .updateOne(
        { _id: new Types.ObjectId(instituteID) },
        { $set: { isntituteStatus: InstituteStatus.ACTIVE } },
      )
      .exec();
    return {
      data: institute,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.institute' },
      },
    };
  }

  async findActiveInstituteByID(
    instituteID: string,
  ): Promise<InstituteDocument | null> {
    return this.instituteModel.findOne<InstituteDocument>({
      $and: [
        {
          _id: new Types.ObjectId(instituteID),
        },
        { isntituteStatus: InstituteStatus.ACTIVE },
      ],
    });
  }

  async findDeletedInstituteByID(
    instituteID: string,
  ): Promise<InstituteDocument | null> {
    return this.instituteModel.findOne<InstituteDocument>({
      $and: [
        {
          _id: new Types.ObjectId(instituteID),
        },
        { isntituteStatus: InstituteStatus.DELETED },
      ],
    });
  }

  async addInstituteManager(
    institutesID: string,
    instituteMangerID: string,
    adminID: string,
  ) {
    const [institute, instituteManagerToAdd, admin] = await Promise.all([
      this.findActiveInstituteByID(institutesID),
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
      institute._id as unknown as InstituteDocument,
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
