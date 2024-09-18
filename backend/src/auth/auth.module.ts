import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service'; // Adjust path as needed
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/utils/jwt.strategy';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { DatabasesModule } from 'src/databases/databases.module';
import { AuthController } from './auth.controller';
import { config } from 'src/utils/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
   
    
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: {
        expiresIn: '12h',
        issuer: config.jwt.issuer,
        algorithm: 'HS256',  
      },
    }), PassportModule,
  ],
  providers: [AuthService, JwtStrategy, UserService, DatabasesModule, PrismaDatabaseService,JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
