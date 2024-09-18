import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { Permission, user, Role } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';

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
  token: '',
  roles: [],
  permissions: [],
};

const mockRole = {
  id: 1,
  name: 'Admin',
  permissions: [],
};

// Mock PrismaDatabaseService
const mockPrisma = {
  permission: {
    create: jest.fn().mockResolvedValue(mockPermission),
    findUnique: jest.fn().mockResolvedValue(mockPermission),
    findMany: jest.fn().mockResolvedValue([mockPermission]),
    update: jest.fn().mockResolvedValue(mockPermission),
    delete: jest.fn().mockResolvedValue(undefined),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
    findMany: jest.fn().mockResolvedValue([mockUser]),
  },
  userPermission: {
    create: jest.fn().mockResolvedValue(undefined),
    deleteMany: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    createMany: jest.fn().mockResolvedValue(undefined),
  },
  role: {
    findUnique: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    findMany: jest.fn().mockResolvedValue([mockRole]),
  },
};

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaDatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaDatabaseService>(PrismaDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPermission', () => {
    it('should create a permission', async () => {
      const dto = { name: 'READ', description: 'Read permission' };
      const result = await service.createPermission(dto);
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.permission, 'create').mockRejectedValue(new Error('Error'));
      await expect(service.createPermission({ name: 'READ', description: 'Read permission' }))
        .rejects.toThrow('Failed to create Permission: Error');
    });
  });

  describe('getPermissionById', () => {
    it('should return a permission by ID', async () => {
      const result = await service.getPermissionById(1);
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { roles: true, userPermission: { include: { user: true } } },
      });
    });
  });

  describe('getPermissionByName', () => {
    it('should return a permission by name', async () => {
      const result = await service.getPermissionByName('READ');
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { name: 'READ' },
        include: { roles: true, userPermission: { include: { user: true } } },
      });
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      const result = await service.getAllPermissions();
      expect(result).toEqual([mockPermission]);
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        include: { roles: true },
      });
    });
  });

  describe('updatePermission', () => {
    it('should update a permission', async () => {
      const dto = { name: 'UPDATED', description: 'Updated description' };
      const result = await service.updatePermission(1, dto);
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      await service.deletePermission(1);
      expect(prisma.permission.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.permission, 'delete').mockRejectedValue(new Error('Error'));
      await expect(service.deletePermission(1)).rejects.toThrow('Failed to delete permission: Error');
    });
  });

  describe('assignPermissionTouser', () => {
    it('should assign a permission to a user', async () => {
      const result = await service.assignPermissionTouser(1, 1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { permissions: true },
      });
      expect(prisma.userPermission.create).toHaveBeenCalledWith({
        data: { userId: 1, permissionId: 1 },
      });
    });
  });

  // describe('unassignPermissionFromuser', () => {
  //   it('should unassign a permission from a user', async () => {
  //     await service.assignPermissionTouser(1, 1);
  //     const result = await service.unassignPermissionFromuser(1, 1);
  //     expect(result).toEqual(mockUser);
      
  //     // console.log(prisma.userPermission.delete.mock.calls); // Log actual calls for debugging
      
  //     expect(prisma.user.findUnique).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //       include: { permissions: true },
  //     });
      
  //     expect(prisma.userPermission.delete).toHaveBeenCalledWith({
  //       where: { unique_user_permission: { userId: 1, permissionId: 1 } },
  //     });
  //   });
  // });
  

  describe('syncPermissionsTouser', () => {
    it('should sync permissions to a user', async () => {
      const result = await service.syncPermissionsTouser(1, [1, 2, 3]);
      expect(result).toEqual(mockUser);
      expect(prisma.userPermission.deleteMany).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(prisma.userPermission.createMany).toHaveBeenCalledWith({
        data: [
          { userId: 1, permissionId: 1 },
          { userId: 1, permissionId: 2 },
          { userId: 1, permissionId: 3 },
        ],
      });
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign a permission to a role', async () => {
      const result = await service.assignPermissionToRole(1, 1);
      expect(result).toEqual(mockRole);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { permissions: { connect: { id: 1 } } },
      });
    });
  });

  describe('unassignPermissionFromRole', () => {
    it('should unassign a permission from a role', async () => {
      await service.assignPermissionToRole(1, 1);
      const result = await service.unassignPermissionFromRole(1, 1);
      expect(result).toEqual(mockRole);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { permissions: { disconnect: { id: 1 } } },
      });
    });
  });

  describe('syncRolePermissions', () => {
    it('should sync permissions to a role', async () => {
      const result = await service.syncRolePermissions(1, [1, 2, 3]);
      expect(result).toEqual(mockRole);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          permissions: {
            set: [
              { id: 1 },
              { id: 2 },
              { id: 3 },
            ],
          },
        },
      });
    });
  });
});
