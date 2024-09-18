import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { Role, user } from '.prisma/client'; // Assuming your Prisma models are exported like this
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data: createRoleDto ,
      });
    } catch (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }
  }

  async getRoleById(id: number): Promise<Role> {
    return await this.prisma.role.findUnique({
      where: { id:+id  },
      include: {
        permissions: true,

        users: {
          include: {
            
          },
        },
      },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.prisma.role.findMany({
      include: {
        permissions: true,
        users: {
          include: {
            user:true
          },
        },
      },
    });
  }

  async updateRole(id: number, createRoleDto: CreateRoleDto): Promise<Role> {
    await this.prisma.role.update({
      where: {  id:+id },
      data: createRoleDto,
    });
    return this.getRoleById(+id);
  }

  async deleteRole(id: number): Promise<void> {
    await this.prisma.role.delete({
      where: { id:+id },
    });
  }

 
  async assignRoleTouser(roleId: number, user_id: number): Promise<any> {
    try {
      // Check if the role exists
      const role = await this.prisma.role.findUnique({
        where: { id: +roleId },
        include: { permissions: true },
      });
  
      if (!role) {
        throw new NotFoundException(`Role with id ${roleId} not found`);
      }
  
      // Check if the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
        include: { roles: true, permissions: true },
      });
  
      if (!user) {
        throw new NotFoundException('user not found');
      }
  
      // Check if the role is already assigned to the user
      const existingRole = user.roles.some(r => r.roleId === roleId);
      if (existingRole) {
        return this.prisma.user.findUnique({
          where: { id: +user.id },
          include: { permissions: true, roles: true },
        });
      }
  
      // Create a list of permission IDs to add
      const permissionIdsToAdd = role.permissions.map(p => p.id);
  
      // Filter out existing permissions from the list
      const existingPermissionIds = user.permissions.map(p => p.id);
      const newPermissionIds = permissionIdsToAdd.filter(id => !existingPermissionIds.includes(id));
  
      // Create new user permissions for the new permission IDs
      if (newPermissionIds.length > 0) {
        await this.prisma.userPermission.createMany({
          data: newPermissionIds.map(permissionId => ({
            userId: user.id,
            permissionId: permissionId,
          })),
        });
      }
  
      // Assign the role to the user
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleId,
        },
      });
  
      // Retrieve the updated user with permissions and roles
      return this.prisma.user.findUnique({
        where: { id: +user.id },
        include: { permissions: true, roles: true },
      });
  
    } catch (error) {
      throw new Error(`Failed to connect role to user: ${error.message}`);
    }
  }

  async assignRoleToUser(roleName: string, userId: number): Promise<any> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
        include: { permissions: true },
      });
  
      if (!role) {
        throw new NotFoundException(`Role with name ${roleName} not found`);
      }
  
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { roles: true, permissions: true },
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const existingRole = user.roles.some(r => r.roleId === role.id);
      if (existingRole) {
        return this.prisma.user.findUnique({
          where: { id: +user.id },
          include: { permissions: true, roles: true },
        });
      }
  
      const permissionIdsToAdd = role.permissions.map(p => p.id);
      const existingPermissionIds = user.permissions.map(p => p.id);
      const newPermissionIds = permissionIdsToAdd.filter(id => !existingPermissionIds.includes(id));
  
      if (newPermissionIds.length > 0) {
        await this.prisma.userPermission.createMany({
          data: newPermissionIds.map(permissionId => ({
            userId: user.id,
            permissionId: permissionId,
          })),
        });
      }
  
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
  
      return this.prisma.user.findUnique({
        where: { id: +user.id },
        include: { permissions: true, roles: true },
      });
  
    } catch (error) {
      throw new Error(`Failed to connect role to user: ${error.message}`);
    }
  }
  
  
  
  async removeRoleFromuser(roleId: number, user_id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
        include: { roles: true, permissions: true },
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const existingRole = user.roles.some(r => r.roleId === roleId);
      if (!existingRole) {
        return this.prisma.user.findUnique({
          where: { id: +user.id },
          include: { permissions: true, roles: true },
        });
      }
  
      await this.prisma.userRole.delete({
        where: {
          unique_user_role: {
            userId: +user.id,
            roleId: +roleId,
          },
        },
      });
  
      const rolePermissions = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true },
      });
  
      if (rolePermissions) {
        const permissionIds = rolePermissions.permissions.map(p => p.id);
        await this.prisma.userPermission.deleteMany({
          where: {
            userId: +user.id,
            permissionId: { in: permissionIds },
          },
        });
      }
  
      return this.prisma.user.findUnique({
        where: { id: +user.id },
        include: { permissions: true, roles: true },
      });
  
    } catch (error) {
      throw new Error(`Failed to remove role from user: ${error.message}`);
    }
  }
  
  
  

  // async removeAllRolesFromuser(user_id: number): Promise<any> {
  //   try {
  //     // Find the user by employee_id and include roles
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: user_id},
  //       include: {  permissions: true },
  //     });
  
  //     if (!user) {
  //       throw new NotFoundException('user not found');
  //     }
  
  //     // Extract all permission IDs associated with the user's roles
  //     const permissionIdsToRemove: number[] = [];
  //     user.roles.forEach(role => {
  //       role.permissions.forEach(permission => {
  //         permissionIdsToRemove.push(permission.id);
  //       });
  //     });
  
  //     // Update user to remove all roles and associated permissions
  //     const updateduser = await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         roles: {
  //           set: [], // Set roles to an empty array to remove all associations
  //         },
  //       },
  //       include: { permissions: true },
  //     });
  
  //     // Delete all associated permissions from the user
  //     await this.prisma.userPermission.deleteMany({
  //       where: {
  //         userId: user.id,
  //         permissionId: { in: permissionIdsToRemove },
  //       },
  //     });
  
  //     return updateduser;
  
  //   } catch (error) {
  //     throw new Error(`Failed to remove all roles from user: ${error.message}`);
  //   }
  // }
  
}
