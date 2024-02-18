import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { ROUTES } from '@shared/constants/routes.constant';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { UserID } from '@decorators/user-id.decorator';

@Controller(ROUTES.DIVISIONS.CONTROLLER)
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Post(ROUTES.DIVISIONS.CREATE)
  create(
    @Body() createDivisionDto: CreateDivisionDto,
    @Param('institutesID') institutesID: string,
    @UserID() adminID: string,
  ) {
    return this.divisionsService.create(
      createDivisionDto,
      institutesID,
      adminID,
    );
  }

  @Patch(ROUTES.DIVISIONS.ADD_STUDENT)
  addStudent(
    @Param('divisionsID') divisionID: string,
    @Param('studentID') studentID: string,
    @UserID() instituteManagerID: string,
  ) {
    return this.divisionsService.addStudent(
      divisionID,
      studentID,
      instituteManagerID,
    );
  }

  @Patch(ROUTES.DIVISIONS.ADD_TEACHER)
  addTeahcer(
    @Param('divisionsID') divisionID: string,
    @Param('teacherID') studentID: string,
    @UserID() instituteManagerID: string,
  ) {
    return this.divisionsService.addTeacher(
      divisionID,
      studentID,
      instituteManagerID,
    );
  }

  @Get()
  findAll() {
    return this.divisionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionsService.update(+id, updateDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divisionsService.remove(+id);
  }
}
