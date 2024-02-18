import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstituteManagersService } from './institute-managers.service';
import { UpdateInstituteManagerDto } from './dto/update-institute-manager.dto';

@Controller('institute-manager')
export class InstituteManagersController {
  constructor(
    private readonly instituteManagerService: InstituteManagersService,
  ) {}

  @Get()
  findAll() {
    return this.instituteManagerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instituteManagerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstituteManagerDto: UpdateInstituteManagerDto,
  ) {
    return this.instituteManagerService.update(+id, updateInstituteManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instituteManagerService.remove(+id);
  }
}
