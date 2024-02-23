import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ParseMongooseObjectIdPipe } from 'core/pipe/parse-mogoose-objectID.pipe';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { ROUTES } from '@shared/constants/routes.constant';

@Controller(ROUTES.STUDENTS.CONTROLLER)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.STUDENTS.FIND_ALL)
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(ROUTES.STUDENTS.FIND_ONE)
  findOne(@Param('studentID', ParseMongooseObjectIdPipe) studentID: string) {
    return this.studentsService.findOne(studentID);
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT])
  @Patch(ROUTES.STUDENTS.UPDATE_ONE)
  update(
    @Param('studentID', ParseMongooseObjectIdPipe) studentID: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(studentID, updateStudentDto);
  }

  @Roles([Role.SUPER_ADMIN])
  @Patch(ROUTES.STUDENTS.SUSPEND_ONE)
  remove(@Param('studentID', ParseMongooseObjectIdPipe) studentID: string) {
    return this.studentsService.suspendOrUnsuspendStudent(studentID);
  }
}
