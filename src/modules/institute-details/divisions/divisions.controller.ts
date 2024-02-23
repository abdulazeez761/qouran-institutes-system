import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { ROUTES } from '@shared/constants/routes.constant';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { UserID } from '@decorators/user-id.decorator';
import { ParseMongooseObjectIdPipe } from 'core/pipe/parse-mogoose-objectID.pipe';

@Controller(ROUTES.DIVISIONS.CONTROLLER)
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Post(ROUTES.DIVISIONS.CREATE)
  create(
    @Body() createDivisionDto: CreateDivisionDto,
    @Param('institutesID', ParseMongooseObjectIdPipe) institutesID: string,
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
    @Param('divisionsID', ParseMongooseObjectIdPipe) divisionID: string,
    @Param('studentID', ParseMongooseObjectIdPipe) studentID: string,
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
    @Param('divisionsID', ParseMongooseObjectIdPipe) divisionID: string,
    @Param('teacherID', ParseMongooseObjectIdPipe) studentID: string,
    @UserID() instituteManagerID: string,
  ) {
    return this.divisionsService.addTeacher(
      divisionID,
      studentID,
      instituteManagerID,
    );
  }
  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.DIVISIONS.FIND_ALL)
  findAll() {
    return this.divisionsService.findAll();
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Get(ROUTES.DIVISIONS.FIND_INSTITUTE_DIVISION)
  findInsituteDivisions(
    @Param('instituteID', ParseMongooseObjectIdPipe) instiiuteID: string,
  ) {
    return this.divisionsService.findInstituteDivisions(instiiuteID);
  }

  @Get(ROUTES.DIVISIONS.FIND_ONE)
  findOne(
    @Param('institutesID', ParseMongooseObjectIdPipe) instituteID: string,
    @Param('divisionsID', ParseMongooseObjectIdPipe) divionID: string,
  ) {
    return this.divisionsService.findOne(instituteID, divionID);
  }

  @Patch(ROUTES.DIVISIONS.UPDATE_ONE)
  update(
    @Param('divisionID') divionID: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionsService.update(updateDivisionDto, divionID);
  }

  @Patch(ROUTES.DIVISIONS.DELETE_ONE)
  remove(@Param('divisionID', ParseMongooseObjectIdPipe) divisionID: string) {
    return this.divisionsService.deleteOrUnDelete(divisionID);
  }
}
