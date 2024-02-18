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
        'yoy are not an adming of this intitute',
        HttpStatus.NOT_FOUND,
      );
    if (!isntitute) throw new HttpException('dfds', HttpStatus.NOT_FOUND);

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

  findAll() {
    return `This action returns all teachers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} ${updateTeacherDto} teacher`;
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
      ],
    });
  }
  async findTeacherByID(teacherID: string): Promise<UserDocument | null> {
    return this.teacherModel.findOne<UserDocument>({
      $and: [{ _id: new Types.ObjectId(teacherID) }, { role: Role.TEACHER }],
    });
  }
  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
