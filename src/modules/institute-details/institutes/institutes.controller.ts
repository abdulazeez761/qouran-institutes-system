import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { ROUTES } from '@shared/constants/routes.constant';
import { Role } from '@shared/enums/role.enum';
import { Roles } from '@decorators/roles.decorator';
import { UserID } from '@decorators/user-id.decorator';

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

  @Roles([Role.SUPER_ADMIN])
  @Get(ROUTES.INSTITUTES.FIND_ONE)
  findOne(@Param('institutesID') institutesID: string) {
    return this.institutesService.findOne(+institutesID);
  }

  @Patch(ROUTES.INSTITUTES.UPDATE_ONE)
  update(
    @Param('institutesID') institutesID: string,
    @Body() updateInstituteDto: UpdateInstituteDto,
  ) {
    return this.institutesService.update(+institutesID, updateInstituteDto);
  }

  @Delete(ROUTES.INSTITUTES.DELETE_ONE)
  remove(@Param('institutesID') institutesID: string) {
    return this.institutesService.remove(+institutesID);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Patch(ROUTES.INSTITUTES.ADD_INSTITUTE_MANAGER)
  addAdmin(
    @Param('institutesID') institutesID: string,
    @Param('managerID') managerID: string,
    @UserID() adminID: string,
  ) {
    return this.institutesService.addInstituteManager(
      institutesID,
      managerID,
      adminID,
    );
  }
}
