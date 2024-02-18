import { DivisionsService } from './../divisions/divisions.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentWirdDto } from './dto/create-student-wird.dto';
import { UpdateStudentWirdDto } from './dto/update-student-wird.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shared/constants/schemas.constant';
import { Model } from 'mongoose';
import { StudentWirddDocument } from './types/wirds-document.type';
import { ResponseFromServiceI } from '@shared/interfaces/general/response-from-service.interface';
import { TeachersService } from '@modules/system-users/teachers/teachers.service';
import { StudentsService } from '@modules/system-users/students/students.service';
import { UserDocument } from '@modules/system-users/users/types/user-document.type';

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
      this.divisionsService.findDivivsionByID(divisionID),
      this.teachersService.findTeacherByDivisionID(teacherID, divisionID),
      this.studentsService.findStudentByDivisonID(studentID, divisionID),
    ]);

    if (!division)
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
        args: { entity: 'entities.user' },
      },
      data: createdWird,
    };
  }

  findAll() {
    return `This action returns all studentWirds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentWird`;
  }

  update(_id: number, updateStudentWirdDto: UpdateStudentWirdDto) {
    return `This action updates a #${updateStudentWirdDto} studentWird`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentWird`;
  }
}
