import { Module } from '@nestjs/common';
import { StudentWirdsService } from './student-wirds.service';
import { StudentWirdsController } from './student-wirds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { divisionMongooseModel } from './entities/student-wird.entity';
import { DivisionsModule } from '../divisions/divisions.module';
import { StudentsModule } from '@modules/system-users/students/students.module';
import { TeachersModule } from '@modules/system-users/teachers/teachers.module';

@Module({
  controllers: [StudentWirdsController],
  providers: [StudentWirdsService],
  imports: [
    MongooseModule.forFeature([divisionMongooseModel]),
    StudentsModule,
    TeachersModule,
    DivisionsModule,
  ],
})
export class StudentWirdsModule {}
