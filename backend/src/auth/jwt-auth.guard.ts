import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService, JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { config } from '../utils/config'; // Ensure correct path

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private jwtService: JwtService;

  

  constructor() {
    super();
    const jwtOptions: JwtModuleOptions = {
      secret: config.jwt.secret,
      signOptions: { expiresIn: '12h', algorithm: 'HS256' }, // Adjust as needed
    };
    this.jwtService = new JwtService(jwtOptions);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not found or malformed');
    }

    const token = authHeader.split(' ')[1];
    try {
      this.jwtService.verify(token, { secret: config.jwt.secret });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return super.canActivate(context) as boolean;
  }
}
