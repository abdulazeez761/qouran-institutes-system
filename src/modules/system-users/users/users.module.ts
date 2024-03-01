import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userMongooseModel } from './entities/user.entity';
import { FileUploadModule } from '@lib/file-upload/file-upload.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [MongooseModule.forFeature([userMongooseModel]), FileUploadModule],
})
export class UsersModule {}
