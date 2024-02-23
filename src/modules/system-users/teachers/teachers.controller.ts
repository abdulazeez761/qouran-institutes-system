import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { ROUTES } from '@shared/constants/routes.constant';

@Controller(ROUTES.TEACHERS.CONTROLLER)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.TEACHERS.FIND_ALL)
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(ROUTES.TEACHERS.FIND_ONE)
  findOne(@Param('teacherID') teacherID: string) {
    return this.teachersService.findOne(teacherID);
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER])
  @Patch(ROUTES.TEACHERS.UPDATE_ONE)
  update(
    @Param('teacherID') teacherID: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(teacherID, updateTeacherDto);
  }

  @Roles([Role.SUPER_ADMIN])
  @Patch(ROUTES.TEACHERS.SUSPEND_ONE)
  remove(@Param('teacherID') teacherID: string) {
    return this.teachersService.suspendOrUnSuspendTeahcer(teacherID);
  }
}
