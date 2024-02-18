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

@Controller(ROUTES.WIRDS.CONTROLLER)
export class StudentWirdsController {
  constructor(private readonly studentWirdsService: StudentWirdsService) {}

  @Roles([Role.TEACHER, Role.ADMIN, Role.SUPER_ADMIN])
  @Post(ROUTES.WIRDS.CREATE)
  create(
    @Body() createStudentWirdDto: CreateStudentWirdDto,
    @UserID() teacherID: string,
    @Param('studentID') studentID: string,
    @Param('divisionsID') divisionID: string,
  ) {
    return this.studentWirdsService.create(
      createStudentWirdDto,
      teacherID,
      studentID,
      divisionID,
    );
  }

  @Get()
  findAll() {
    return this.studentWirdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentWirdsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentWirdDto: UpdateStudentWirdDto,
  ) {
    return this.studentWirdsService.update(+id, updateStudentWirdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentWirdsService.remove(+id);
  }
}
