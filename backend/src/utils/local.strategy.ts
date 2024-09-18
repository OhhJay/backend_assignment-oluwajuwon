 
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { matchPasswordHash } from './password-hash';
import { UserService } from 'src/user/user.service';
 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordHash: boolean = await matchPasswordHash(password, user.password);
    if (passwordHash) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}