import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';  
import { Permission, user } from '@prisma/client'; 
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { Roles } from 'src/utils/decorators/role-permission.decorator';


@Controller('permissions')

@UseGuards(JwtAuthGuard, RolesPermissionsGuard)  
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post() 
  @Roles('Super Admin','HR') 
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      const createdPermission = await this.permissionsService.createPermission(createPermissionDto);
      return {
        message: 'Permission created successfully',
        data: createdPermission,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  } 

  @Get('name/:name') 
  async getPermissionByname(@Param('name') name: string): Promise<Permission> {
    return this.permissionsService.getPermissionByName(name);
  }
  @Get(':id')
  async getPermissionById(@Param('id') id: number): Promise<Permission> {
    return this.permissionsService.getPermissionById(+id);
  }

  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionsService.getAllPermissions();
  }

  @Put(':id')
  @Roles('Super Admin','HR') 
  async updatePermission(@Param('id') id: number, @Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.updatePermission(+id, createPermissionDto);
  }

  @Delete(':id')
  @Roles('Super Admin','HR') 
  async deletePermission(@Param('id') id: number): Promise<void> {
    return this.permissionsService.deletePermission(+id);
  }

  @Post(':permissionId/users/:user_id')
  @Roles('Super Admin','HR') 
  async assignPermissionTouser(@Param('permissionId') permissionId: number, @Param('user_id') user_id: number): Promise<user> {
    return this.permissionsService.assignPermissionTouser(+permissionId, user_id);
  }

  @Delete(':permissionId/users/:user_id')
  @Roles('Super Admin','HR') 
  async unassignPermissionFromuser(@Param('permissionId') permissionId: number, @Param('user_id') user_id: number): Promise<user> {
    return this.permissionsService.unassignPermissionFromuser(+permissionId, user_id);
  }

  @Post('sync/:user_id')
  @Roles('Super Admin','HR') 
  async syncPermissionsTouser(
    @Param('user_id') user_id: number,
    @Body('permissionIds') permissionIds: number[],
  ): Promise<user> {
    return this.permissionsService.syncPermissionsTouser(user_id, permissionIds);
  }

  
  @Post(':permissionId/roles/:roleId')
  @Roles('Super Admin','HR') 
  async assignPermissionToRole(
    @Param('permissionId') permissionId: number,
    @Param('roleId') roleId: number
  ) {
    try {
      const role = await this.permissionsService.assignPermissionToRole(+permissionId, +roleId);
      return {
        message: 'Permission assigned to role successfully',
        data: role,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Failed to assign permission to role: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':permissionId/roles/:roleId')
  @Roles('Super Admin','HR') 
  async unassignPermissionFromRole(
    @Param('permissionId') permissionId: number,
    @Param('roleId') roleId: number
  ) {
    try {
      const role = await this.permissionsService.unassignPermissionFromRole(+permissionId, +roleId);
      return {
        message: 'Permission unassigned from role successfully',
        data: role,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Failed to unassign permission from role: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('roles/:roleId/sync')
  @Roles('Super Admin','HR') 
  async syncRolePermissions(
    @Param('roleId') roleId: number,
    @Body('permissionIds') permissionIds: number[]
  ) {
    try {
      const role = await this.permissionsService.syncRolePermissions(roleId, permissionIds);
      return {
        message: 'Permissions synced to role successfully',
        data: role,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Failed to sync permissions to role: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
