import { Body, Controller, Get, Post, Response, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response as Res, Request as Req } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  async signin(@Body() dto: LoginDto, @Response() res: Res) {
    const token = await this.authService.signin(dto);
    res.set('Authorization', 'Bearer ' + token);
    res.send({ success: true, token });
  }
  @Get('logout')
  //TODO
  async logOut(@Response() res: Res) {
    return res.set('Authorization', null);
  }
}
