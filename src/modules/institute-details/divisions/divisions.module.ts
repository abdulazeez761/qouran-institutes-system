import { Module } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { divisionMongooseModel } from './entities/division.entity';
import { InstitutesModule } from '../institutes/institutes.module';
import { InstituteManagersModule } from '@modules/system-users/institute-managers/institute-managers.module';
import { StudentsModule } from '@modules/system-users/students/students.module';
import { TeachersModule } from '@modules/system-users/teachers/teachers.module';

@Module({
  controllers: [DivisionsController],
  providers: [DivisionsService],
  exports: [DivisionsService],
  imports: [
    MongooseModule.forFeature([divisionMongooseModel]),
    InstitutesModule,
    InstituteManagersModule,
    StudentsModule,
    TeachersModule,
  ],
})
export class DivisionsModule {}
