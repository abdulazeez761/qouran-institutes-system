import { DivisionsService } from './../divisions/divisions.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentWirdDto } from './dto/create-student-wird.dto';
import { UpdateStudentWirdDto } from './dto/update-student-wird.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model, Types } from 'mongoose';
import { StudentWirddDocument } from './types/wirds-document.type';
import { ResponseFromServiceI } from '@shared/interfaces/general/response-from-service.interface';
import { TeachersService } from '@modules/system-users/teachers/teachers.service';
import { StudentsService } from '@modules/system-users/students/students.service';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';
import { InstituteStatus } from '../institutes/enum/institute-status.enum';

@Injectable()
export class StudentWirdsService {
  constructor(
    @InjectModel(SCHEMAS.WIRD)
    private readonly studentWirdsModel: Model<StudentWirddDocument>,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
    private readonly divisionsService: DivisionsService,
  ) {}
  async create(
    createStudentWirdDto: CreateStudentWirdDto,
    teacherID: string,
    studentID: string,
    divisionID: string,
  ): Promise<ResponseFromServiceI<StudentWirddDocument>> {
    const [division, teacher, student] = await Promise.all([
      this.divisionsService.findActiveDivisionByID(divisionID),
      this.teachersService.findTeacherByDivisionID(teacherID, divisionID),
      this.studentsService.findStudentByDivisonID(studentID, divisionID),
    ]);

    if (
      !division ||
      division.institute?.isntituteStatus === InstituteStatus.DELETED
    )
      throw new HttpException(
        `division does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    if (
      !teacher ||
      !student ||
      !division.students?.includes(student._id as unknown as UserDocument) ||
      !division.teachers?.includes(teacher._id as unknown as UserDocument)
    )
      throw new HttpException(
        `teacher or student does not belong to this division`,
        HttpStatus.BAD_REQUEST,
      );

    const wirdToCreate = new this.studentWirdsModel(createStudentWirdDto);
    wirdToCreate.student = student;
    wirdToCreate.teacher = teacher;
    wirdToCreate.division = division;
    const createdWird = await wirdToCreate.save();
    student.studentProperties?.wirds.push(
      createdWird._id as unknown as StudentWirddDocument,
    );
    await student.save();
    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.wird' },
      },
      /* Most JavaScript codebases consider objects
      created using curly braces {} to be POJOs. that's why I'm using toJson insted of
      toOjbect because toObject convert the data into pojo 
      and my response type is key and value */
      data: createdWird.toJSON({
        flattenObjectIds: true,
        depopulate: true,
      }),
    };
  }

  async findAllstudentWirds(
    divisionID: string,
    studentID: string,
  ): Promise<ResponseFromServiceI<StudentWirddDocument[]>> {
    const wirds = await this.findStudentWirds(divisionID, studentID);
    if (!wirds)
      throw new HttpException(
        'this student has no wirds',
        HttpStatus.NOT_FOUND,
      );

    return {
      data: wirds,
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.wird' },
      },
    };
  }

  async update(
    wirdID: string,
    updateStudentWirdDto: UpdateStudentWirdDto,
  ): Promise<ResponseFromServiceI<StudentWirddDocument>> {
    const wird = await this.findWirdByID(wirdID);
    if (!wird)
      throw new HttpException('wird does not exist', HttpStatus.NOT_FOUND);
    await this.studentWirdsModel.updateOne(
      { _id: new Types.ObjectId(wirdID) },
      { $set: { ...updateStudentWirdDto } },
    );

    return {
      data: wird,
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.wird' },
      },
    };
  }

  async remove(wirdID: string) {
    const wird = await this.findWirdByID(wirdID);
    if (!wird)
      throw new HttpException('wird does not exist', HttpStatus.NOT_FOUND);
    await this.studentWirdsModel.deleteOne({ _id: new Types.ObjectId(wirdID) });
    return {
      data: wird,
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.wird' },
      },
    };
  }
  async findOne(
    wirdID: string,
  ): Promise<ResponseFromServiceI<StudentWirddDocument>> {
    const wird = await this.findWirdByID(wirdID);
    if (!wird)
      throw new HttpException('wird does not exist', HttpStatus.NOT_FOUND);
    return {
      data: wird,
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.wird' },
      },
    };
  }

  async findWirdByID(wirdID: string): Promise<StudentWirddDocument | null> {
    return await this.studentWirdsModel
      .findById<StudentWirddDocument>(wirdID)
      .exec();
  }
  async findStudentWirds(
    divisionID: string,
    studentID: string,
  ): Promise<StudentWirddDocument[] | null> {
    return await this.studentWirdsModel
      .find<StudentWirddDocument>({
        $and: [
          { division: new Types.ObjectId(divisionID) },
          { student: new Types.ObjectId(studentID) },
        ],
      })
      .exec();
  }

  // might be deleted
  async findTeacherCreatedWirds(
    divisionID: string,
    teacherID: string,
  ): Promise<ResponseFromServiceI<StudentWirddDocument[]>> {
    const wirds = await this.findTeachertWirds(divisionID, teacherID);
    if (!wirds)
      throw new HttpException(
        'this student has no wirds',
        HttpStatus.NOT_FOUND,
      );

    return {
      data: wirds,
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.wird' },
      },
    };
  }

  async findTeachertWirds(
    divisionID: string,
    teacherID: string,
  ): Promise<StudentWirddDocument[] | null> {
    return await this.studentWirdsModel
      .find({
        $and: [
          { division: new Types.ObjectId(divisionID) },
          { teacher: new Types.ObjectId(teacherID) },
        ],
      })
      .exec();
  }
}
