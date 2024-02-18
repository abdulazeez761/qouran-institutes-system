import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userMongooseModel } from '../users/entities/user.entity';
import { InstitutesModule } from '@modules/institute-details/institutes/institutes.module';
import { InstituteManagersModule } from '../institute-managers/institute-managers.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
  imports: [
    MongooseModule.forFeature([userMongooseModel]),
    InstitutesModule,
    InstituteManagersModule,
  ],
})
export class StudentsModule {}
