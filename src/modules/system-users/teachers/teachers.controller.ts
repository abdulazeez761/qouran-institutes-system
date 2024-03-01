import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { ROUTES } from '@shared/constants/routes.constant';
import { UserID } from '@decorators/user-id.decorator';

@Controller(ROUTES.TEACHERS.CONTROLLER)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.TEACHERS.FIND_ALL)
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(ROUTES.TEACHERS.FIND_ONE)
  findOne(@Param('teacherID') teacherID: string) {
    return this.teachersService.findOne(teacherID);
  }

  @Patch(ROUTES.TEACHERS.UPDATE_ONE)
  update(
    @UserID() teacherID: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(teacherID, updateTeacherDto);
  }

  // should be added in admin service
  @Roles([Role.SUPER_ADMIN])
  @Patch(ROUTES.TEACHERS.SUSPEND_ONE)
  remove(@Param('teacherID') teacherID: string) {
    return this.teachersService.suspendOrUnSuspendTeahcer(teacherID);
  }
}
