import { InstituteManagersModule } from '@modules/system-users/institute-managers/institute-managers.module';
import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { instituteMongooseModel } from './entities/institute.entity';
import { AdminsModule } from '@modules/system-users/admins/admins.module';

@Module({
  controllers: [InstitutesController],
  providers: [InstitutesService],
  exports: [InstitutesService],
  imports: [
    MongooseModule.forFeature([instituteMongooseModel]),
    AdminsModule,
    InstituteManagersModule,
  ],
})
export class InstitutesModule {}
