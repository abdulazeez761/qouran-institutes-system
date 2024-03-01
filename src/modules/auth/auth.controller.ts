import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { Public } from 'core/decorators/public.decorator';
import { UserID } from 'core/decorators/user-id.decorator';
import { ROUTES } from 'shared/constants/routes.constant';
import { registerRouteApiResponse } from './constants/register-route-api-response.conatant';
import { LogUserInDto } from './dto/log-user-in.dto';
import { LoginService } from './login.service';
import { LogoutService } from './logout.service';
import { RegisterService } from './register.service';
import { CreateUserDto } from 'modules/system-users/users/dto/create-user.dto';
import { CreateAdminDto } from '@modules/system-users/admins/dto/create-admin.dto';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@shared/enums/role.enum';
import { CreateStudentDto } from '@modules/system-users/students/dto/create-student.dto';
import { ParseMongooseObjectIdPipe } from 'core/pipe/parse-mogoose-objectID.pipe';
import { Response } from 'express';
@ApiTags(ROUTES.AUTH.CONTROLLER)
@Controller(ROUTES.AUTH.CONTROLLER)
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly logoutService: LogoutService,
  ) {}

  @Public()
  @ApiResponse(registerRouteApiResponse)
  @Post(ROUTES.AUTH.REGISTER_USER)
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.registerService.registerUser(createUserDto);
  }

  @Roles([Role.SUPER_ADMIN])
  @Post(ROUTES.AUTH.REGISTER_SUPER_ADMIN)
  registerSuperAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UserID() authorID: string,
  ) {
    return this.registerService.registerSuperAdmin(createAdminDto, authorID);
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Post(ROUTES.AUTH.REGISTER_INSTITUTE_MANAGERS)
  registerInstituteAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UserID() authorID: string,
  ) {
    return this.registerService.registerInstituteAdmin(
      createAdminDto,
      authorID,
    );
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Post(ROUTES.AUTH.REGISTER_INSTITUTE_TEACHER)
  registerDivisionTeacher(
    @Body() createStudentDto: CreateStudentDto,
    @Param('instituteID', ParseMongooseObjectIdPipe) instituteID: string,
    @UserID() authorID: string,
  ) {
    return this.registerService.registerInstituteTeacher(
      createStudentDto,
      instituteID,
      authorID,
    );
  }

  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @Post(ROUTES.AUTH.REGISTER_INSTITUTE_STUDENT)
  registerDivisionStudetn(
    @Body() createStudentDto: CreateStudentDto,
    @Param('instituteID', ParseMongooseObjectIdPipe) instituteID: string,
    @UserID() authorID: string,
  ) {
    return this.registerService.registerIntituteStudent(
      createStudentDto,
      instituteID,
      authorID,
    );
  }

  @Public()
  @Post(ROUTES.AUTH.LOG_USER_IN)
  logUserIn(
    @Body() logUserInDto: LogUserInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.loginService.logUserIn(logUserInDto, response);
  }

  @Post(ROUTES.AUTH.LOG_OUT)
  logUserOut(
    @UserID() userID: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logoutService.logUserOut(userID, response);
  }
}
