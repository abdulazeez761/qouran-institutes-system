import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './system-users/users/users.module';
import { AdminsModule } from './system-users/admins/admins.module';
import { TeachersModule } from './system-users/teachers/teachers.module';
import { StudentsModule } from './system-users/students/students.module';
import { DivisionsModule } from './institute-details/divisions/divisions.module';
import { StudentWirdsModule } from './institute-details/student-wirds/student-wirds.module';
import { InstitutesModule } from './institute-details/institutes/institutes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    InstitutesModule,
    DivisionsModule,
    AdminsModule,
    TeachersModule,
    StudentsModule,
    StudentWirdsModule,
  ],
})
export class ModulesModule {}
