import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userMongooseModel } from '../users/entities/user.entity';
import { InstitutesModule } from '@modules/institute-details/institutes/institutes.module';
import { InstituteManagersModule } from '../institute-managers/institute-managers.module';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
  imports: [
    MongooseModule.forFeature([userMongooseModel]),
    InstitutesModule,
    InstituteManagersModule,
  ],
})
export class TeachersModule {}
