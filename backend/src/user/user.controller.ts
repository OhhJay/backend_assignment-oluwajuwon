import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/role-permission.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesPermissionsGuard)  
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('Super Admin','HR') 
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto);
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Failed to create user',
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Roles('Super Admin','HR') 
  async findAll() {
    try {
      const result = await this.userService.findAll();
      return {
        status: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve users',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.userService.findOne(+id);
      if (!result) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        }, HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Failed to retrieve user',
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @Roles('Super Admin','HR') 
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userService.update(+id, updateUserDto);
      if (!result) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        }, HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Failed to update user',
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles('Super Admin','HR') 
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userService.remove(+id);
      if (!result) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        }, HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Failed to delete user',
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
