import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CacheService } from 'core/lib/cache/cache.service';
import { UserDocument } from 'modules/system-users/users/types/user-document.type';
import { UsersService } from 'modules/system-users/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { Response } from 'express';
@Injectable()
export class LogoutService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
  ) {}

  async logUserOut(
    userID: string,
    response: Response,
  ): Promise<ResponseFromServiceI<UserDocument>> {
    const userToLogout = await this.userService.findByID(userID);
    if (!userToLogout)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    await this.cacheService.deleteField(userID + '', 'refreshToken');
    response.clearCookie('accessToken');
    return {
      message: 'auth.success.logout',
      httpStatus: HttpStatus.OK,
      data: userToLogout,
    };
  }
}
