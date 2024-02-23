import { InstituteManagersService } from '@modules/system-users/institute-managers/institute-managers.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model, Types } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { Role } from '@shared/enums/role.enum';
import { UserDocument } from '../users/types/user-document.type';
import { InstitutesService } from '@modules/institute-details/institutes/institutes.service';
import { AccountStatus } from '../users/enums/account-status.enum';
import { ResponseFromServiceI } from '@shared/interfaces/general/response-from-service.interface';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(SCHEMAS.USER) private readonly studenstModel: Model<User>,
    private readonly instituteManagersService: InstituteManagersService,
    private readonly institutesService: InstitutesService,
  ) {}

  async createInstituteStudentForAuth(
    createStudentDto: CreateStudentDto,
    instituteID: string,
    authorID: string,
  ) {
    const [author, isntitute] = await Promise.all([
      await this.instituteManagersService.findInstituteManagerByID(authorID),
      await this.institutesService.findActiveInstituteByID(instituteID),
    ]);
    if (!author)
      throw new HttpException(
        'what are you trying to do !-_-',
        HttpStatus.BAD_REQUEST,
      );
    if (
      !isntitute?.instituteManagers?.includes(
        author._id as unknown as UserDocument,
      ) &&
      author.role !== Role.SUPER_ADMIN
    )
      throw new HttpException(
        'you are not an admin of this institue',
        HttpStatus.NOT_FOUND,
      );

    if (!isntitute)
      throw new HttpException(
        'institute doesn not exist',
        HttpStatus.NOT_FOUND,
      );

    const studetnToCreate = new this.studenstModel(createStudentDto);
    studetnToCreate.role = Role.STUDENT;
    studetnToCreate.studentProperties = {
      wirds: [],
      divisions: [],
      institute: isntitute,
    };
    const createdStudent = await studetnToCreate.save();

    isntitute.studets?.push(studetnToCreate._id as unknown as UserDocument);
    author.instituteManagerProperties?.students?.push(
      studetnToCreate._id as unknown as UserDocument,
    );
    await Promise.all([isntitute.save(), author.save()]);

    return createdStudent;
  }

  async findAll(): Promise<ResponseFromServiceI<UserDocument[] | null>> {
    const users = await this.studenstModel.find({ role: Role.STUDENT });
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
    studentID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const student = await this.findStudentByID(studentID);

    if (!student)
      throw new HttpException("student doesn't exist!", HttpStatus.NOT_FOUND);

    return {
      data: student,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.user' },
      },
    };
  }

  async update(
    studentID: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const student = await this.findStudentByID(studentID);

    if (!student)
      throw new HttpException("student doesn't exist!", HttpStatus.NOT_FOUND);

    await this.studenstModel.updateOne(
      { _id: new Types.ObjectId(studentID) },
      { $set: { ...updateStudentDto } },
    );

    return {
      data: student,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
    };
  }

  async suspendOrUnsuspendStudent(
    studentID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const student = await this.studenstModel.findOne<UserDocument>({
      $and: [{ _id: new Types.ObjectId(studentID) }, { role: Role.STUDENT }],
    });
    if (!student)
      throw new HttpException("student doesn't exist!", HttpStatus.NOT_FOUND);

    const status =
      student.accountStatus === AccountStatus.ACTIVE
        ? AccountStatus.DELETED
        : AccountStatus.ACTIVE;

    await this.studenstModel
      .updateOne(
        { _id: new Types.ObjectId(studentID) },
        { $set: { accountStatus: status } },
      )
      .exec();
    student.accountStatus = status;
    return {
      data: student,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
    };
  }

  async findStudentByID(StudentID: string): Promise<UserDocument | null> {
    return this.studenstModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(StudentID) },
        { role: Role.STUDENT },
        { accountStatus: AccountStatus.ACTIVE },
      ],
    });
  }

  async findStudentByDivisonID(
    StudentID: string,
    divisonID: string,
  ): Promise<UserDocument | null> {
    return this.studenstModel.findOne<UserDocument>({
      $and: [
        { _id: new Types.ObjectId(StudentID) },
        {
          'studentProperties.divisions': {
            $in: [new Types.ObjectId(divisonID)],
          },
        },
        { role: Role.STUDENT },
        { accountStatus: AccountStatus.ACTIVE },
      ],
    });
  }
}
