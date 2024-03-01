import { NestMiddleware, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DecodedTokenI } from '@shared/interfaces/http/decoded-token.interface';
import { PrivateTokenPayloadI } from '@shared/interfaces/http/token-payload.interface';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RefreshTokenMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    if (accessToken) {
      try {
        this.jwtService.verify<DecodedTokenI>(accessToken, {
          secret: this.configService.get<string>('USER_ACCESS_TOKEN_SECRET')!,
        });
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          res.clearCookie('accessToken');
          const decodedAccessToken =
            this.jwtService.decode<DecodedTokenI>(accessToken);
          const { role, sub } = decodedAccessToken; // passing the same valuse of the recived accessToken
          const privatePayload: PrivateTokenPayloadI = {
            sub,
            role,
          };
          const refreshedAccesssToken = this.jwtService.sign(privatePayload, {
            secret: this.configService.get<string>('USER_ACCESS_TOKEN_SECRET')!,
            expiresIn: this.configService.get<string>(
              'USER_ACCESS_TOKEN_EXPIRES_IN',
            )!,
          });
          const isProduction =
            this.configService.get<string>('NODE_ENV') === 'prod';

          res.cookie('accessToken', refreshedAccesssToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: true,
            expires: new Date(Date.now() + 86400 * 1000),
            secure: isProduction,
          });

          req.cookies['accessToken'] = refreshedAccesssToken;
        }
      }
    }
    next();
  }
}
