import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentWirdDto } from './create-student-wird.dto';

export class UpdateStudentWirdDto extends PartialType(CreateStudentWirdDto) {}
