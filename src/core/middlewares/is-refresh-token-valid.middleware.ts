// import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@lib/cache/cache.service';
import { CacheObjectI } from '@lib/cache/interfaces/cache-object.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DecodedTokenI } from '@shared/interfaces/http/decoded-token.interface';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class IsReFreshTokenValidMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    if (accessToken) {
      const decodedToken = this.jwtService.decode<DecodedTokenI>(accessToken);
      const { sub } = decodedToken;

      const cacheObject = await this.cacheService.get<CacheObjectI>(sub + '');
      const refreshTokenFromCach = cacheObject?.refreshToken;

      if (refreshTokenFromCach) {
        try {
          this.jwtService.verify<DecodedTokenI>(refreshTokenFromCach, {
            secret: this.configService.get<string>(
              'USER_REFRESH_TOKEN_SECRET',
            )!,
          });
        } catch (error: any) {
          if (error.name === 'TokenExpiredError') {
            this.cacheService.del(sub);
            res.clearCookie('accessToken');
          }
        }
      }
    }
    next();
  }
}
