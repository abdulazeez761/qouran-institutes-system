import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Role } from '@shared/enums/role.enum';
import { Model, Types } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { UserDocument } from '../users/types/user-document.type';
// import { DivisionDocument } from '@modules/institute-details/divisions/types/division-document.type';
import { InstitutesService } from '@modules/institute-details/institutes/institutes.service';
import { InstituteManagersService } from '../institute-managers/institute-managers.service';
import { AccountStatus } from '../users/enums/account-status.enum';
import { ResponseFromServiceI } from '@shared/interfaces/general/response-from-service.interface';

@Injectable()
export class TeachersService {
  create(_createTeacherDto: CreateTeacherDto) {
    return 'test';
  }
  constructor(
    @InjectModel(SCHEMAS.USER) private readonly teacherModel: Model<User>,
    private readonly instituteManagersService: InstituteManagersService,
    private readonly institutesService: InstitutesService,
  ) {}

  async createInstituteTeacerForAuth(
    createTeacherDto: CreateTeacherDto,
    instituteID: string,
    authorID: string,
  ): Promise<UserDocument> {
    const [author, isntitute] = await Promise.all([
      await this.instituteManagersService.findInstituteManagerByID(authorID),
      await this.institutesService.findActiveInstituteByID(instituteID),
    ]);

    if (!author)
      throw new HttpException(
        'what are you trying to do !-_-',
        HttpStatus.BAD_REQUEST,
      );
    if (!isntitute)
      throw new HttpException(
        'institute does not exist!',
        HttpStatus.NOT_FOUND,
      );
    if (
      !isntitute?.instituteManagers?.includes(
        author._id as unknown as UserDocument,
      ) &&
      author.role !== Role.SUPER_ADMIN
    )
      throw new HttpException(
        'yoy are not an adming of this intitute',
        HttpStatus.NOT_FOUND,
      );

    const teacherToCreate = new this.teacherModel(createTeacherDto);
    teacherToCreate.role = Role.TEACHER;
    teacherToCreate.teacherProperties = {
      institute: isntitute,
      divisions: [],
    };

    const createdTeacher = await teacherToCreate.save();

    isntitute.teachers?.push(teacherToCreate._id as unknown as UserDocument);
    author.instituteManagerProperties?.teachers?.push(
      teacherToCreate._id as unknown as UserDocument,
    );
    await Promise.all([isntitute.save(), author.save()]);

    return createdTeacher;
  }

  async findAll(): Promise<ResponseFromServiceI<UserDocument[] | null>> {
    const users = await this.teacherModel.find({ role: Role.TEACHER });
    return {
      data: users,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.user' },
      },
    };
  }

  async findOne(
    teacherID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const teacher = await this.findActiveTeacherByID(teacherID);

    if (!teacher)
      throw new HttpException("teacher doesn't exist!", HttpStatus.NOT_FOUND);

    return {
      data: teacher,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.user' },
      },
    };
  }

  async update(
    teacherID: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const teacher = await this.findActiveTeacherByID(teacherID);

    if (!teacher)
      throw new HttpException("teacher doesn't exist!", HttpStatus.NOT_FOUND);

    await this.teacherModel.updateOne(
      { _id: new Types.ObjectId(teacherID) },
      { $set: { ...updateTeacherDto } },
    );

    return {
      data: teacher,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
    };
  }

  async suspendOrUnSuspendTeahcer(
    teahcerID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const teacher = await this.teacherModel.findOne<UserDocument>({
      $and: [{ _id: new Types.ObjectId(teahcerID) }, { role: Role.TEACHER }],
    });
    if (!teacher)
      throw new HttpException("teacher doesn't exist!", HttpStatus.NOT_FOUND);

    const status =
      teacher.accountStatus === AccountStatus.ACTIVE
        ? AccountStatus.DELETED
        : AccountStatus.ACTIVE;

    await this.teacherModel
      .updateOne(
        { _id: new Types.ObjectId(teahcerID) },
        { $set: { accountStatus: status } },
      )
      .exec();
    teacher.accountStatus = status;
    return {
      data: teacher,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
    };
  }

  async findTeacherByDivisionID(
    userID: string,
    divisonID: string,
  ): Promise<UserDocument | null> {
    return this.teacherModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(userID) },
        {
          'teacherProperties.divisions': {
            $in: [new Types.ObjectId(divisonID)],
          },
        },
        { role: Role.TEACHER },
        { accountStatus: AccountStatus.ACTIVE },
      ],
    });
  }
  async findActiveTeacherByID(teacherID: string): Promise<UserDocument | null> {
    return this.teacherModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(teacherID) },
        { role: Role.TEACHER },
        { accountStatus: AccountStatus.ACTIVE },
      ],
    });
  }
}
