import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { user, Role } from '@prisma/client'; 
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { Roles } from 'src/utils/decorators/role-permission.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesPermissionsGuard)  
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('Super Admin','HR') 
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    try {
      const createdRole = await this.rolesService.createRole(createRoleDto);
      return {
        message: 'Role created successfully',
        data: createdRole,
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

  @Get(':id')
  @Roles('Super Admin','HR') 
  async getRoleById(@Param('id') id: number) {
    try {
      const role = await this.rolesService.getRoleById(id);
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return {
        message: 'Role retrieved successfully',
        data: role,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status:` Role with id ${id} not founds` || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles('Super Admin','HR') 
  async getAllRoles() {
    try {
      const roles = await this.rolesService.getAllRoles();
      return {
        message: 'Roles retrieved successfully',
        data: roles,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @Roles('Super Admin','HR') 
  async updateRole(@Param('id') id: number, @Body('name') createRoleDto: CreateRoleDto) {
    try {
      const updatedRole = await this.rolesService.updateRole(id, createRoleDto);
      return {
        message: 'Role updated successfully',
        data: updatedRole,
        status: HttpStatus.OK,
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

  @Delete(':id')
  @Roles('Super Admin','HR') 
  async deleteRole(@Param('id') id: number) {
    try {
      await this.rolesService.deleteRole(id);
      return {
        message: 'Role deleted successfully',
        status: HttpStatus.NO_CONTENT,
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

  @Post(':roleId/users/:user_id')
  @Roles('Super Admin','HR') 
  async assignRoleTouser(
    @Param('roleId') roleId: number,
    @Param('user_id') user_id: number
  ) {
    try {
      const updateduser = await this.rolesService.assignRoleTouser(+roleId, +user_id);
      return {
        message: 'Role assigned to user successfully',
        data: updateduser,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':roleId/users/:user_id')
  @Roles('Super Admin','HR') 
  async removeRoleFromuser(
    @Param('roleId') roleId: number,
    @Param('user_id') user_id: number,
  ) {
    try {
      const updateduser = await this.rolesService.removeRoleFromuser(+roleId, +user_id);
      return {
        message: 'Role removed from user successfully',
        data: updateduser,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Delete('users/:user_id/all')
  // async removeAllRolesFromuser(@Param('user_id') user_id: number) {
  //   try {
  //     const updateduser = await this.rolesService.removeAllRolesFromuser(+user_id);
  //     return {
  //       message: 'All roles removed from user successfully',
  //       data: updateduser,
  //       status: HttpStatus.OK,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: error.status || HttpStatus.BAD_REQUEST,
  //         error: error.message,
  //       },
  //       error.status || HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
