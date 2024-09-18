import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission, user, Role } from '.prisma/client';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
 

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      return await this.prisma.permission.create({
        data: createPermissionDto,
      });
    } catch (error) {
      throw new Error(`Failed to create Permission: ${error.message}`);
    }
  }

  async getPermissionById(id: number): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { id },
      include: {
      
        roles: true, // Includes related roles
        userPermission: {
          include: {
            user: true, // Includes related users for each userPermission
          },
        },
      },
    });
  }
 
 
  async getPermissionByName(name: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { name },
      include: {
        
        roles: true, // Includes related roles
        userPermission: {
          include: {
            user: true, // Includes related users for each userPermission
          },
        },
      },
    });
  }
  

  async getAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      include: {
       
        roles: true, // Includes related roles
         
      },
    });
  }

  async updatePermission(id: number,createPermissionDto: CreatePermissionDto): Promise<Permission> {
    await this.prisma.permission.update({
      where: { id },
      data: createPermissionDto,
    });
    return this.getPermissionById(id);
  }


  
  async deletePermission(permissionId: number): Promise<void> {
    const permission = await this.getPermissionById(+permissionId);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found.`);
    }
    try {
      // Fetch all roles that have the permission
      const rolesWithPermission = await this.prisma.role.findMany({
        where: {
          permissions: {
            some: {
              id: permissionId,
            },
          },
        },
        include: {
          permissions: true,
        },
      });

      // Disconnect the permission from each role
      for (const role of rolesWithPermission) {
        const updatedRole = await this.prisma.role.update({
          where: { id: +role.id },
          data: {
            permissions: {
              disconnect: {
                id: permissionId,
              },
            },
          },
        });
      }

      // Delete the permission from all users
      await this.prisma.userPermission.deleteMany({
        where: {
          permissionId: +permissionId,
        },
      });

      // Delete the permission itself
      await this.prisma.permission.delete({
        where: {
          id: +permissionId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete permission: ${error.message}`);
    }
  }

async assignPermissionTouser(permissionId: number, user_id: number): Promise<user> {
  const permission = await this.getPermissionById(+permissionId);
  if (!permission) {
    throw new NotFoundException(`Permission with ID ${permissionId} not found.`);
  }

  const user = await this.prisma.user.findUnique({
    where: { id: user_id  },
    include: { permissions: true },
  });
  if (!user) {
    throw new NotFoundException('user not found.');
  }

  // Check if the permission is already assigned to the user
  const existingPermission = user.permissions.some(
    (perm) => perm.permissionId === permissionId,
  );
  if (existingPermission) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: { permissions: true },
    });
  }

  await this.prisma.userPermission.create({
    data: {
      userId: +user.id,
      permissionId: +permission.id,

    },
  });

  return this.prisma.user.findUnique({
    where: { id: +user.id },
    include: { roles: {
      include:{
        role:true
      }
    }, // Includes related roles
    permissions: {
      include: {
        permission: true, // Includes related permission details in userPermission
      },
    }, },
  });
}
 
async unassignPermissionFromuser(permissionId: number, user_id: number): Promise<user> {
  const user = await this.prisma.user.findUnique({
    where: { id: user_id },
    include: { permissions: true },
  });
  if (!user) {
    throw new NotFoundException('user not found.');
  }
  const existingPermission = user.permissions.some(
    (perm) => perm.permissionId === permissionId,
  );
  if (!existingPermission) {
    return this.prisma.user.findUnique({
      where: { id: +user.id },
      include: { permissions: true },
    });
  }
  await this.prisma.userPermission.delete({
    where: {
      unique_user_permission: {
        userId: +user.id,
        permissionId: +permissionId,
      },
    },
  });

  return this.prisma.user.findUnique({
    where: { id: +user.id },
    include: { permissions: true },
  });
}


  async syncPermissionsTouser(user_id: number, permissionIds: number[]): Promise<user> {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: { permissions: true },
    });
    if (!user) {
      throw new NotFoundException('user not found.');
    }

    await this.prisma.userPermission.deleteMany({
      where: { userId: +user.id },
    });

    const createPermissions = permissionIds.map(permissionId => ({
      userId: +user.id,
      permissionId,
    }));

    await this.prisma.userPermission.createMany({
      data: createPermissions,
    });

    return this.prisma.user.findUnique({
      where: { id: +user.id },
      include: { permissions: true ,roles:true},
    });
  }

  async assignPermissionToRole(permissionId: number, roleId: number): Promise<Role> {
    const permission = await this.getPermissionById(+permissionId);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found.`);
    }

    const role = await this.prisma.role.findUnique({
      where: { id: +roleId },
      include: { permissions: true,  },
    });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.prisma.role.update({
      where: { id: +role.id },
      data: {
        permissions: {
          connect: { id: permissionId },
        },
      },
    });
    
      // Sync the permission with all users that have this role
      await this.syncPermissionsWithRole(roleId, [permissionId]);
    return this.prisma.role.findUnique({
      where: { id: +role.id },
      include: {  permissions: true },
    });
  }

  async unassignPermissionFromRole(permissionId: number, roleId: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id: +roleId },
      include: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.prisma.role.update({
      where: { id: +role.id },
      data: {
        permissions: {
          disconnect: { id: permissionId },
        },
      },
    });

    return this.prisma.role.findUnique({
      where: { id: +role.id },
      include: { permissions: true },
    });
  }

  async syncRolePermissions(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id: +roleId },
      include: {  permissions: true },
    });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.prisma.role.update({
      where: { id: +role.id },
      data: {
        permissions: {
          set: permissionIds.map(id => ({ id })),
        },
      },
    });

      // Sync the permission with all users that have this role
      await this.syncPermissionsWithRole(roleId, permissionIds);
    return this.prisma.role.findUnique({
      where: { id: +role.id },
      include: {  permissions: true },
    });
  }


  
  async syncPermissionsWithRole(roleId: number, permissionIds: number[]): Promise<void> {
    try {
      // Fetch all users with the given role
      const users = await this.prisma.user.findMany({
        where: {
          roles: {
            some: {
              roleId: +roleId,
            },
          },
        },
        include: {
          permissions: true,
        },
      });
  
      // Loop through each user and sync all permissions
      for (const user of users) {
        for (const permissionId of permissionIds) {
          const hasPermission = user.permissions.some(p => p.permissionId === permissionId);
          if (!hasPermission) {
            await this.prisma.userPermission.create({
              data: {
                userId: user.id,
                permissionId: permissionId,
              },
            });
          }
        }
      }
    } catch (error) {
      throw new Error(`Failed to sync permissions with role: ${error.message}`);
    }
  }
  


  async getEmployeeWithPermission(){
    
  }

  // async addPermissionToRole(roleId: number, permissionId: number): Promise<void> {
  //   try {
  //     // Add the permission to the role
  //     await this.prisma.rolePermission.create({
  //       data: {
  //         roleId: roleId,
  //         permissionId: permissionId,
  //       },
  //     });

  //     // Sync the permission with all users that have this role
  //     await this.syncPermissionsWithRole(roleId, permissionId);
  //   } catch (error) {
  //     throw new Error(`Failed to add permission to role: ${error.message}`);
  //   }
  // }
}
