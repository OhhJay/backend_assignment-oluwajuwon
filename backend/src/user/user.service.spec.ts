import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

// Mock data
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

// Mock Prisma client
const mockPrisma = {
  user: {
    create: jest.fn().mockResolvedValue(mockUser),
    findMany: jest.fn().mockResolvedValue([mockUser]),
    findUnique: jest.fn().mockResolvedValue(mockUser),
    findFirst: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(mockUser),
  },
  role: {
    findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'user' }),
  },
  permission: {
    findMany: jest.fn().mockResolvedValue([]),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaDatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaDatabaseService>(PrismaDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Mock bcrypt.hash
      jest.spyOn(bcrypt, 'hash' as any).mockResolvedValue('hashedpassword');

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedpassword',
          roles: {
            create: {
              roleId: 1,
            },
          },
        },
        include: { roles: true },
      });
    });
  });

  describe('validateUser', () => {
    it('should return a user if email and password are correct', async () => {
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await service.validateUser('john.doe@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await service.validateUser('john.doe@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });

    it('should throw NotFoundException if an error occurs', async () => {
      jest.spyOn(prisma.user, 'findMany').mockRejectedValue(new Error('Error'));
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { firstname: 'Jane' };
      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  
  
 
});
