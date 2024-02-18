import { TeachersService } from '@modules/system-users/teachers/teachers.service';
import { StudentsService } from './../system-users/students/students.service';
import { CreateTeacherDto } from './../system-users/teachers/dto/create-teacher.dto';
import { AdminsService } from '@modules/system-users/admins/admins.service';
import { CreateAdminDto } from '@modules/system-users/admins/dto/create-admin.dto';
import { CreateStudentDto } from '@modules/system-users/students/dto/create-student.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'modules/system-users/users/dto/create-user.dto';
import { UserDocument } from 'modules/system-users/users/types/user-document.type';
import { UsersService } from 'modules/system-users/users/users.service';

import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { InstituteManagersService } from '@modules/system-users/institute-managers/institute-managers.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
    private readonly studentsService: StudentsService,
    private readonly teacherPropertiesSchemaeachersService: TeachersService,
    private readonly instituteManagersService: InstituteManagersService,
  ) {}
  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const { password } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createUserDto.password = hashedPassword;

    const createdUser =
      await this.usersService.createUserForAuth(createUserDto);

    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdUser,
    };
  }

  async registerSuperAdmin(
    createAdminDto: CreateAdminDto,
    authorID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const { password } = createAdminDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createAdminDto.password = hashedPassword;

    const createdAdmin = await this.adminsService.createSuperAdminForTheSystem(
      createAdminDto,
      authorID,
    );

    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdAdmin,
    };
  }
  // intitute admin is the sheikh
  async registerInstituteAdmin(
    createAdminDto: CreateAdminDto,
    authorID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const { password } = createAdminDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createAdminDto.password = hashedPassword;

    const createdAdmin =
      await this.instituteManagersService.createInstitutemanagerForAuth(
        createAdminDto,
        authorID,
      );
    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdAdmin,
    };
  }

  async registerInstituteTeacher(
    createTeacherDto: CreateTeacherDto,
    instituteID: string,
    authorID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const { password } = createTeacherDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createTeacherDto.password = hashedPassword;

    const createdAdmin =
      await this.teacherPropertiesSchemaeachersService.createInstituteTeacerForAuth(
        createTeacherDto,
        instituteID,
        authorID,
      );
    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdAdmin,
    };
  }

  async registerIntituteStudent(
    createStudentDto: CreateStudentDto,
    instituteID: string,
    authorID: string,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const { password } = createStudentDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createStudentDto.password = hashedPassword;

    const createdAdmin =
      await this.studentsService.createInstituteStudentForAuth(
        createStudentDto,
        instituteID,
        authorID,
      );
    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdAdmin,
    };
  }
}
