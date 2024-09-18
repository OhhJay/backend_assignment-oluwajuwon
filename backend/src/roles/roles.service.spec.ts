import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { Role, user } from '.prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';

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
  token: '',
  roles: [{ roleId: 1 }],
  permissions: [],
};

// Mock PrismaDatabaseService
const mockPrisma = {
  role: {
    create: jest.fn().mockResolvedValue(mockRole),
    findUnique: jest.fn().mockResolvedValue(mockRole),
    findMany: jest.fn().mockResolvedValue([mockRole]),
    update: jest.fn().mockResolvedValue(mockRole),
    delete: jest.fn().mockResolvedValue(undefined),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
  },
  userRole: {
    create: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  },
};

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: PrismaDatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const dto: CreateRoleDto = { name: 'Admin' };
      const result = await service.createRole(dto);
      expect(result).toEqual(mockRole);
      expect(mockPrisma.role.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockPrisma.role, 'create').mockRejectedValue(new Error('Error'));
      const dto: CreateRoleDto = { name: 'Admin' };
      await expect(service.createRole(dto)).rejects.toThrowError('Failed to create role: Error');
    });
  });

  describe('getRoleById', () => {
    it('should return a role by ID', async () => {
      const result = await service.getRoleById(1);
      expect(result).toEqual(mockRole);
      expect(mockPrisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { permissions: true, users: { include: {} } },
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockPrisma.role, 'findUnique').mockRejectedValue(new Error('Error'));
      await expect(service.getRoleById(1)).rejects.toThrowError('Error');
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const result = await service.getAllRoles();
      expect(result).toEqual([mockRole]);
      expect(mockPrisma.role.findMany).toHaveBeenCalledWith({
        include: { permissions: true, users: { include: { user: true } } },
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockPrisma.role, 'findMany').mockRejectedValue(new Error('Error'));
      await expect(service.getAllRoles()).rejects.toThrowError('Error');
    });
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      const dto: CreateRoleDto = { name: 'Updated Admin' };
      const result = await service.updateRole(1, dto);
      expect(result).toEqual(mockRole);
      expect(mockPrisma.role.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockPrisma.role, 'update').mockRejectedValue(new Error('Error'));
      const dto: CreateRoleDto = { name: 'Updated Admin' };
      await expect(service.updateRole(1, dto)).rejects.toThrowError('Error');
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      await service.deleteRole(1);
      expect(mockPrisma.role.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockPrisma.role, 'delete').mockRejectedValue(new Error('Error'));
      await expect(service.deleteRole(1)).rejects.toThrowError('Error');
    });
  });

  // describe('assignRoleToUser', () => {
  //   it('should assign a role to a user', async () => {
  //     const mockRole = { id: 1, name: 'Admin', permissions: [{ id: 1 }] };
  //     const mockUser = { id: 1, roles: [{ roleId: 1 }], permissions: [] };
  
  //     jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValue(mockRole as any);
  //     jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(mockUser as any);
  //     jest.spyOn(mockPrisma.userRole, 'create').mockResolvedValue(mockUser as any);
     
  //     const result = await service.assignRoleToUser('Admin', 1);
  //     expect(result).toEqual(mockUser);
  //     expect(mockPrisma.role.findUnique).toHaveBeenCalledWith({
  //       where: { name: 'Admin' },
  //       include: { permissions: true },
  //     });
  //     expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //       include: { roles: true, permissions: true },
  //     });
  //     expect(mockPrisma.userRole.create).toHaveBeenCalledWith({
  //       data: { userId: 1, roleId: 1 },
  //     });
     
  //   });
  
  //   it('should handle errors', async () => {
  //     jest.spyOn(mockPrisma.role, 'findUnique').mockRejectedValue(new Error('Error'));
  //     await expect(service.assignRoleToUser('Admin', 1)).rejects.toThrowError('Failed to connect role to user: Error');
  //   });
  // });
  
  // describe('removeRoleFromuser', () => {
  //   it('should remove a role from a user', async () => {
  //     const mockRole = { id: 1, permissions: [{ id: 1 }] };
  //     const mockUser = { id: 1, roles: [{ roleId: 1 }], permissions: [{ id: 1 }] };
  
  //     jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(mockUser as any);
  //     jest.spyOn(mockPrisma.role, 'findUnique').mockResolvedValue(mockRole as any);
  //     jest.spyOn(mockPrisma.userRole, 'delete').mockResolvedValue({} as any); 
  //     const result = await service.removeRoleFromuser(1, 1);
  //     expect(result).toEqual(mockUser);
  //     expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //       include: { roles: true, permissions: true },
  //     });
  //     expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
  //       where: { unique_user_role: { userId: 1, roleId: 1 } },
  //     }); 
  //   });
  
  //   it('should handle errors', async () => {
  //     jest.spyOn(mockPrisma.userRole, 'delete').mockRejectedValue(new Error('Error'));
  //     await expect(service.removeRoleFromuser(1, 1)).rejects.toThrowError('Failed to remove role from user: Error');
  //   });
  // });
  
  
});
