import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission, user } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { UserService } from 'src/user/user.service';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';

// Mock data
const mockPermission: Permission = {
  id: 1,
  name: 'READ',
  description: 'Read permission',
};

const mockUser = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
  token:'',
  roles: [],
  permissions: [],
};

const mockUserService = {
  // Mock methods if needed
};

// Mock PermissionsService
const mockPermissionsService = {
  createPermission: jest.fn().mockResolvedValue(mockPermission),
  getPermissionByName: jest.fn().mockResolvedValue(mockPermission),
  getPermissionById: jest.fn().mockResolvedValue(mockPermission),
  getAllPermissions: jest.fn().mockResolvedValue([mockPermission]),
  updatePermission: jest.fn().mockResolvedValue(mockPermission),
  deletePermission: jest.fn().mockResolvedValue(undefined),
  assignPermissionTouser: jest.fn().mockResolvedValue(mockUser),
  unassignPermissionFromuser: jest.fn().mockResolvedValue(mockUser),
  syncPermissionsTouser: jest.fn().mockResolvedValue(mockUser),
  assignPermissionToRole: jest.fn().mockResolvedValue(mockPermission),
  unassignPermissionFromRole: jest.fn().mockResolvedValue(mockPermission),
  syncRolePermissions: jest.fn().mockResolvedValue(mockPermission),
};

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        { provide: PermissionsService, useValue: mockPermissionsService },
        { provide: UserService, useValue: mockUserService },  
        RolesPermissionsGuard,  
        Reflector, 
        PrismaDatabaseService,  
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPermission', () => {
    it('should create a permission', async () => {
      const dto: CreatePermissionDto = { name: 'READ', description: 'Read permission' };
      const result = await controller.createPermission(dto);
      expect(result).toEqual({
        message: 'Permission created successfully',
        data: mockPermission,
        status: HttpStatus.CREATED,
      });
      expect(service.createPermission).toHaveBeenCalledWith(dto);
    });

    it('should handle errors', async () => {
      const dto: CreatePermissionDto = { name: 'READ', description: 'Read permission' };
      jest.spyOn(service, 'createPermission').mockRejectedValue(new Error('Error'));
      await expect(controller.createPermission(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('getPermissionByname', () => {
    it('should return a permission by name', async () => {
      const result = await controller.getPermissionByname('READ');
      expect(result).toEqual(mockPermission);
      expect(service.getPermissionByName).toHaveBeenCalledWith('READ');
    });
  });

  describe('getPermissionById', () => {
    it('should return a permission by ID', async () => {
      const result = await controller.getPermissionById(1);
      expect(result).toEqual(mockPermission);
      expect(service.getPermissionById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      const result = await controller.getAllPermissions();
      expect(result).toEqual([mockPermission]);
      expect(service.getAllPermissions).toHaveBeenCalled();
    });
  });

  describe('updatePermission', () => {
    it('should update a permission', async () => {
      const dto: CreatePermissionDto = { name: 'READ', description: 'Read permission' };
      const result = await controller.updatePermission(1, dto);
      expect(result).toEqual(mockPermission);
      expect(service.updatePermission).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      await controller.deletePermission(1);
      expect(service.deletePermission).toHaveBeenCalledWith(1);
    });
  });

  describe('assignPermissionTouser', () => {
    it('should assign a permission to a user', async () => {
      const result = await controller.assignPermissionTouser(1, 1);
      expect(result).toEqual(mockUser);
      expect(service.assignPermissionTouser).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('unassignPermissionFromuser', () => {
    it('should unassign a permission from a user', async () => {
      const result = await controller.unassignPermissionFromuser(1, 1);
      expect(result).toEqual(mockUser);
      expect(service.unassignPermissionFromuser).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('syncPermissionsTouser', () => {
    it('should sync permissions to a user', async () => {
      const result = await controller.syncPermissionsTouser(1, [1, 2, 3]);
      expect(result).toEqual(mockUser);
      expect(service.syncPermissionsTouser).toHaveBeenCalledWith(1, [1, 2, 3]);
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign a permission to a role', async () => {
      const result = await controller.assignPermissionToRole(1, 1);
      expect(result).toEqual({
        message: 'Permission assigned to role successfully',
        data: mockPermission,
        status: HttpStatus.OK,
      });
      expect(service.assignPermissionToRole).toHaveBeenCalledWith(1, 1);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'assignPermissionToRole').mockRejectedValue(new Error('Error'));
      await expect(controller.assignPermissionToRole(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('unassignPermissionFromRole', () => {
    it('should unassign a permission from a role', async () => {
      const result = await controller.unassignPermissionFromRole(1, 1);
      expect(result).toEqual({
        message: 'Permission unassigned from role successfully',
        data: mockPermission,
        status: HttpStatus.OK,
      });
      expect(service.unassignPermissionFromRole).toHaveBeenCalledWith(1, 1);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'unassignPermissionFromRole').mockRejectedValue(new Error('Error'));
      await expect(controller.unassignPermissionFromRole(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('syncRolePermissions', () => {
    it('should sync permissions to a role', async () => {
      const result = await controller.syncRolePermissions(1, [1, 2, 3]);
      expect(result).toEqual({
        message: 'Permissions synced to role successfully',
        data: mockPermission,
        status: HttpStatus.OK,
      });
      expect(service.syncRolePermissions).toHaveBeenCalledWith(1, [1, 2, 3]);
    });

    it('should handle errors', async () => {
      jest.spyOn(service, 'syncRolePermissions').mockRejectedValue(new Error('Error'));
      await expect(controller.syncRolePermissions(1, [1, 2, 3])).rejects.toThrow(HttpException);
    });
  });
});
