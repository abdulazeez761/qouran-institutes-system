import { Module } from '@nestjs/common';
import { InstituteManagersService } from './institute-managers.service';
import { InstituteManagersController } from './institute-managers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userMongooseModel } from '../users/entities/user.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  controllers: [InstituteManagersController],
  providers: [InstituteManagersService],
  exports: [InstituteManagersService],
  imports: [MongooseModule.forFeature([userMongooseModel]), AdminsModule],
})
export class InstituteManagersModule {}
