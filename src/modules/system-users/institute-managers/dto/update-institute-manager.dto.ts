import { PartialType } from '@nestjs/mapped-types';
import { CreateInstituteManagerDto } from './create-institute-manager.dto';

export class UpdateInstituteManagerDto extends PartialType(CreateInstituteManagerDto) {}
