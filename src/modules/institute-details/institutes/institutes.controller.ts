import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { ROUTES } from '@shared/constants/routes.constant';
import { Role } from '@shared/enums/role.enum';
import { Roles } from '@decorators/roles.decorator';
import { UserID } from '@decorators/user-id.decorator';
import { ParseMongooseObjectIdPipe } from 'core/pipe/parse-mogoose-objectID.pipe';

@Controller(ROUTES.INSTITUTES.CONTROLLER)
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Roles([Role.SUPER_ADMIN])
  @Post(ROUTES.INSTITUTES.CREATE)
  create(
    @Body() createInstituteDto: CreateInstituteDto,
    @UserID() superAminID: string,
  ) {
    return this.institutesService.create(createInstituteDto, superAminID);
  }

  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.INSTITUTES.FIND_ALL)
  findAll() {
    return this.institutesService.findAll();
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Get(ROUTES.INSTITUTES.FIND_ONE)
  findOne(
    @Param('institutesID', ParseMongooseObjectIdPipe) institutesID: string,
  ) {
    return this.institutesService.findOne(institutesID);
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Patch(ROUTES.INSTITUTES.UPDATE_ONE)
  update(
    @Body() updateInstituteDto: UpdateInstituteDto,
    @Param('institutesID', ParseMongooseObjectIdPipe) instituteID: string,
    @UserID() instituteManagerID: string,
  ) {
    return this.institutesService.update(
      updateInstituteDto,
      instituteID,
      instituteManagerID,
    );
  }
  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Patch(ROUTES.INSTITUTES.DELETE_ONE)
  deleteOrUnDeleteInstitute(
    @Param('institutesID', ParseMongooseObjectIdPipe) instituteID: string,
    @UserID() instituteManagerID: string,
  ) {
    return this.institutesService.deleteOrUnDeleteInstitute(
      instituteID,
      instituteManagerID,
    );
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Patch(ROUTES.INSTITUTES.ADD_INSTITUTE_MANAGER)
  addInstituteManager(
    @Param('institutesID', ParseMongooseObjectIdPipe) institutesID: string,
    @Param('managerID', ParseMongooseObjectIdPipe) managerID: string,
    @UserID() adminID: string,
  ) {
    return this.institutesService.addInstituteManager(
      institutesID,
      managerID,
      adminID,
    );
  }
}
