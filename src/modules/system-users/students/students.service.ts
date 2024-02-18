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

@Injectable()
export class StudentsService {
  create(_createStudentDto: CreateStudentDto) {
    return 'test';
  }
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
      await this.institutesService.findInstituteByID(instituteID),
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

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} ${updateStudentDto} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async findStudentByID(StudentID: string): Promise<UserDocument | null> {
    return this.studenstModel.findOne<UserDocument>({
      $and: [{ _id: new Types.ObjectId(StudentID) }, { role: Role.STUDENT }],
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
      ],
    });
  }
}
