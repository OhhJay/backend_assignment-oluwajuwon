import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
 
import * as bcrypt from 'bcrypt';
import { user } from '@prisma/client';


@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<user> {
    const { password, ...userData } = createUserDto;
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
    // Fetch the default role (e.g., 'user') by its name
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'user' },  // You can adjust the name as needed
    });
  
    if (!defaultRole) {
      throw new Error('Default role not found');
    }
  
    // Create user with hashed password and assign the role
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: {
          create: {
            roleId: defaultRole.id,  // Assign the default role to the user
          },
        },
      },
      include: { roles: true },
    });
  
    return newUser;
  }
  
  async validateUser(email: string, password: string): Promise<user | null> {
    const user = await this.prisma.user.findFirst({ 
      where: { email },
    include:{
      roles:{
        include:{
          role:true,
          
        }
      },
      permissions:{
        include:{
          permission:true,
          
        }
      }
    } });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
  async findAll() {
       try {
            
      return await this.prisma.user.findMany({
        include:{
          roles:{
            include:{
              role:true,
              
            }
          },
          permissions:{
            include:{
              permission:true,
              
            }
          }
        }
      });
  } catch (e) {
       
      throw new NotFoundException(e)
  }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include:{
        roles:{
          include:{
            role:true,
            
          }
        },
        permissions:{
          include:{
            permission:true,
            
          }
        }
      }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

      /**
     * 
     * @param email 
     * @returns 
     */
      async getUserByEmail(email: string): Promise<user> {
        try {
            
            return await this.prisma.user.findFirst({
           where:{email:email} });
        } catch (e) {
             
            throw new NotFoundException(e)
        }
    }

  update(id: number, updateUserDto: UpdateUserDto) {
     return this.prisma.user.update({
      where:{id},
      data:updateUserDto
     })
  }

  remove(id: number) {
    return this.prisma.user.delete({where:{id}})
  }


  async findUserWithPermissions(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true, permissions: true },
    });
  }
  
  async getRoleIdsByNames(roleNames: string[]): Promise<number[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        name: { in: roleNames },
      },
      select: {
        id: true,
      },
    });
    return roles.map(role => role.id);
  }

  async getPermissionIdsByNames(permissionNames: string[]): Promise<number[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        name: { in: permissionNames },
      },
      select: {
        id: true,
      },
    });
    return permissions.map(permission => permission.id);
  }
}
