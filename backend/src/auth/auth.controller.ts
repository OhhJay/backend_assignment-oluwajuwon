import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'; 
import { LocalAuthGuard } from 'src/utils/local-auth.guard';
import { AuthService } from './auth.service';
import { loginRequest } from './dto/login.interface';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') 
  async login(@Body() loginRequest:loginRequest,) {
    return this.authService.login(loginRequest);
  }

  @Post('logout') 
@UseGuards(JwtAuthGuard, )  
  async logout(@Body() email:string,) {
    return this.authService.logout(email);
  }
}
