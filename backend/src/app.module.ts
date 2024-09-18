import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { StorageModule } from './storage/storage.module';
import { DatabasesModule } from './databases/databases.module';
import { AuthModule } from './auth/auth.module';
import { RolesPermissionsGuard } from './utils/guards/role-and-permission.guard';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from './utils/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SampleDataModule } from './sample-data/sample-data.module';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: {
        expiresIn: '12h',
        issuer: config.jwt.issuer,
        algorithm: 'HS256',  
      },
    }),
    UserModule,
    RolesModule,
    PermissionsModule,
    StorageModule,
    DatabasesModule,
    AuthModule,
    SampleDataModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, RolesPermissionsGuard,JwtAuthGuard],
})
export class AppModule {}
