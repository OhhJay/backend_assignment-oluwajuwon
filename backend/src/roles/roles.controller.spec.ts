import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service'; 
import { Reflector } from '@nestjs/core';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { UserService } from 'src/user/user.service';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';

// Mock data
const mockRole = {
  id: 1,
  name: 'Admin',
};

const mockUser = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
  token:"",
  roles: [],
  permissions: [],
};

// Mock services
const mockRolesService = {
  createRole: jest.fn().mockResolvedValue(mockRole),
  getRoleById: jest.fn().mockResolvedValue(mockRole),
  getAllRoles: jest.fn().mockResolvedValue([mockRole]),
  updateRole: jest.fn().mockResolvedValue(mockRole),
  deleteRole: jest.fn().mockResolvedValue(undefined),
  assignRoleTouser: jest.fn().mockResolvedValue(mockUser),
  removeRoleFromuser: jest.fn().mockResolvedValue(mockUser),
};

const mockUserService = {
  // Mock methods if needed
};

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RolesService, useValue: mockRolesService },
        { provide: UserService, useValue: mockUserService },  
        RolesPermissionsGuard,  
        Reflector, 
        PrismaDatabaseService,  
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const dto: CreateRoleDto = { name: 'Admin' };
      const result = await controller.createRole(dto);
      expect(result).toEqual({
        message: 'Role created successfully',
        data: mockRole,
        status: HttpStatus.CREATED,
      });
      expect(service.createRole).toHaveBeenCalledWith(dto);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'createRole').mockRejectedValue(new Error('Error'));
      const dto: CreateRoleDto = { name: 'Admin' };
      await expect(controller.createRole(dto))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        }, HttpStatus.BAD_REQUEST));
    });
  });

  describe('getRoleById', () => {
    it('should return a role by ID', async () => {
      const result = await controller.getRoleById(1);
      expect(result).toEqual({
        message: 'Role retrieved successfully',
        data: mockRole,
        status: HttpStatus.OK,
      });
      expect(service.getRoleById).toHaveBeenCalledWith(1);
    });

    it('should handle not found error', async () => {
      jest.spyOn(service, 'getRoleById').mockResolvedValue(null);
      await expect(controller.getRoleById(1))
        .rejects.toThrow( new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "not found",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ))
    });

    it('should handle other errors', async () => {
      jest.spyOn(service, 'getRoleById').mockRejectedValue(new Error('Error'));
      await expect(controller.getRoleById(1))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error',
        }, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const result = await controller.getAllRoles();
      expect(result).toEqual({
        message: 'Roles retrieved successfully',
        data: [mockRole],
        status: HttpStatus.OK,
      });
      expect(service.getAllRoles).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'getAllRoles').mockRejectedValue(new Error('Error'));
      await expect(controller.getAllRoles())
        .rejects.toThrow(new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error',
        }, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      const dto: CreateRoleDto = { name: 'Updated Admin' };
      const result = await controller.updateRole(1, dto);
      expect(result).toEqual({
        message: 'Role updated successfully',
        data: mockRole,
        status: HttpStatus.OK,
      });
      expect(service.updateRole).toHaveBeenCalledWith(1, dto);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'updateRole').mockRejectedValue(new Error('Error'));
      const dto: CreateRoleDto = { name: 'Updated Admin' };
      await expect(controller.updateRole(1, dto))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        }, HttpStatus.BAD_REQUEST));
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const result = await controller.deleteRole(1);
      expect(result).toEqual({
        message: 'Role deleted successfully',
        status: HttpStatus.NO_CONTENT,
      });
      expect(service.deleteRole).toHaveBeenCalledWith(1);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'deleteRole').mockRejectedValue(new Error('Error'));
      await expect(controller.deleteRole(1))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        }, HttpStatus.BAD_REQUEST));
    });
  });

  describe('assignRoleTouser', () => {
    it('should assign a role to a user', async () => {
      const result = await controller.assignRoleTouser(1, 1);
      expect(result).toEqual({
        message: 'Role assigned to user successfully',
        data: mockUser,
        status: HttpStatus.OK,
      });
      expect(service.assignRoleTouser).toHaveBeenCalledWith(1, 1);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'assignRoleTouser').mockRejectedValue(new Error('Error'));
      await expect(controller.assignRoleTouser(1, 1))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        }, HttpStatus.BAD_REQUEST));
    });
  });

  describe('removeRoleFromuser', () => {
    it('should remove a role from a user', async () => {
      const result = await controller.removeRoleFromuser(1, 1);
      expect(result).toEqual({
        message: 'Role removed from user successfully',
        data: mockUser,
        status: HttpStatus.OK,
      });
      expect(service.removeRoleFromuser).toHaveBeenCalledWith(1, 1);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'removeRoleFromuser').mockRejectedValue(new Error('Error'));
      await expect(controller.removeRoleFromuser(1, 1))
        .rejects.toThrow(new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        }, HttpStatus.BAD_REQUEST));
    });
  });
});
