import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentWirdsService } from './student-wirds.service';
import { CreateStudentWirdDto } from './dto/create-student-wird.dto';
import { UpdateStudentWirdDto } from './dto/update-student-wird.dto';
import { ROUTES } from '@shared/constants/routes.constant';
import { UserID } from '@decorators/user-id.decorator';
import { Role } from '@shared/enums/role.enum';
import { Roles } from '@decorators/roles.decorator';
import { ParseMongooseObjectIdPipe } from 'core/pipe/parse-mogoose-objectID.pipe';

@Controller(ROUTES.WIRDS.CONTROLLER)
export class StudentWirdsController {
  constructor(private readonly studentWirdsService: StudentWirdsService) {}

  @Roles([Role.TEACHER, Role.ADMIN, Role.SUPER_ADMIN])
  @Post(ROUTES.WIRDS.CREATE)
  create(
    @Body() createStudentWirdDto: CreateStudentWirdDto,
    @UserID() teacherID: string,
    @Param('studentID', ParseMongooseObjectIdPipe) studentID: string,
    @Param('divisionsID', ParseMongooseObjectIdPipe) divisionID: string,
  ) {
    return this.studentWirdsService.create(
      createStudentWirdDto,
      teacherID,
      studentID,
      divisionID,
    );
  }
  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get(ROUTES.WIRDS.FIND_ALL_STUDENT_WRIDS)
  findAllstudentWirds(
    @Param('divisionID', ParseMongooseObjectIdPipe) divisionID: string,
    @Param('studentID', ParseMongooseObjectIdPipe) studentID: string,
  ) {
    return this.studentWirdsService.findAllstudentWirds(divisionID, studentID);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER])
  @Get(ROUTES.WIRDS.FIND_ALL_TESCHER_WRIDS)
  findTeahcerCraetedWirds(
    @Param('divisionID', ParseMongooseObjectIdPipe) divisionID: string,
    @Param('teacherID', ParseMongooseObjectIdPipe) teacherID: string,
  ) {
    return this.studentWirdsService.findTeacherCreatedWirds(
      divisionID,
      teacherID,
    );
  }

  @Get(ROUTES.WIRDS.FIND_ONE)
  findOne(@Param('wirdID', ParseMongooseObjectIdPipe) wirdID: string) {
    return this.studentWirdsService.findOne(wirdID);
  }

  @Patch(ROUTES.WIRDS.UPDATE_ONE)
  update(
    @Param('wirdID', ParseMongooseObjectIdPipe) wirdID: string,
    @Body() updateStudentWirdDto: UpdateStudentWirdDto,
  ) {
    return this.studentWirdsService.update(wirdID, updateStudentWirdDto);
  }

  @Delete(ROUTES.WIRDS.DELETE_ONE)
  remove(@Param('wirdID', ParseMongooseObjectIdPipe) wirdID: string) {
    return this.studentWirdsService.remove(wirdID);
  }
}
