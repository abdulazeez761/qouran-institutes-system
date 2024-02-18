import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { PasswordService } from './password.service';
import { LogoutService } from './logout.service';
import { UsersModule } from 'modules/system-users/users/users.module';
import { AdminsModule } from '@modules/system-users/admins/admins.module';
import { TeachersModule } from '@modules/system-users/teachers/teachers.module';
import { StudentsModule } from '@modules/system-users/students/students.module';
import { InstituteManagersModule } from '@modules/system-users/institute-managers/institute-managers.module';

@Module({
  controllers: [AuthController],
  providers: [LoginService, RegisterService, PasswordService, LogoutService],
  imports: [
    UsersModule,
    AdminsModule,
    TeachersModule,
    StudentsModule,
    InstituteManagersModule,
  ],
})
export class AuthModule {}
