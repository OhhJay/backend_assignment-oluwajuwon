import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';   
import { loginInterface, loginRequest } from './dto/login.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { user } from '@prisma/client';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { config } from 'src/utils/config';
import moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaDatabaseService
  ) {}
  

  // Method to validate user credentials and generate JWT
  async validateUser(email: string, password: string): Promise<user | null> {
    return this.userService.validateUser(email, password);
  }

  async login(data: loginRequest) { 
    const user = await this.validateUser(data.email,data.password);
    if(!user){
        return {
            status:400,
            message:"Invalid Login Credentials"
        };
    }
    const payload = { email: user.email, sub: user.id,  
      
         };
  
  const token = this.jwtService.sign(payload, {
    secret: config.jwt.secret, 
  }  );
  
    const updatedUser =  await this.prisma.user.update({
        where:{id:user.id},
        data:{token:token},
        include:{
          roles:{include:{
            role:true
          }},
          permissions:{include:{
            permission:true
          }}
        }
    })
    return {
       status:200,
        message:"Success",
        data:{  
          ...updatedUser,
      access_token:token,}
      
    };
  }


  async logout(email:string){
    const user = await this.userService.getUserByEmail(email);
if(user){
  const updatedUser =  await this.prisma.user.update({
      where:{id:user.id},
      data:{token:null},
      include:{
        roles:{include:{
          role:true
        }},
        permissions:{include:{
          permission:true
        }}
      }
  })
}
    return true
  }
}
