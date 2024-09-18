import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(dto => Promise.resolve(dto)),
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(id => Promise.resolve({ id })),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn(id => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com',
        password: 'password'
      };
      const result = await controller.create(dto);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: dto,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(mockUserService, 'create').mockRejectedValue(new Error('Creation error'));
      const dto: CreateUserDto = {
        firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com',
        password: 'password'
      };
      await expect(controller.create(dto)).rejects.toThrowError('Failed to create user');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: [],
      });
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(mockUserService, 'findAll').mockRejectedValue(new Error('Retrieval error'));
      await expect(controller.findAll()).rejects.toThrowError('Failed to retrieve users');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = 1;
      const result = await controller.findOne(id.toString());
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: { id },
      });
      expect(mockUserService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw a 404 error if Failed to retrieve user', async () => {
      jest.spyOn(mockUserService, 'findOne').mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrowError('Failed to retrieve user');
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(mockUserService, 'findOne').mockRejectedValue(new Error('Retrieval error'));
      await expect(controller.findOne('1')).rejects.toThrowError('Failed to retrieve user');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const dto: UpdateUserDto = { firstname: 'John Updated' };
      const result = await controller.update(id.toString(), dto);
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'User updated successfully',
        data: { id, ...dto },
      });
      expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
    });

    it('should throw a 404 error if user not found', async () => {
      jest.spyOn(mockUserService, 'update').mockResolvedValue(null);
      const dto: UpdateUserDto = { firstname: 'John Updated' };
      await expect(controller.update('1', dto)).rejects.toThrowError('Failed to update user');
    });

    it('should throw an error if update fails', async () => {
      jest.spyOn(mockUserService, 'update').mockRejectedValue(new Error('Update error'));
      const dto: UpdateUserDto = { firstname: 'John Updated' };
      await expect(controller.update('1', dto)).rejects.toThrowError('Failed to update user');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 1;
      const result = await controller.remove(id.toString());
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        data: { id },
      });
      expect(mockUserService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw a 404 error if Failed to retrieve user', async () => {
      jest.spyOn(mockUserService, 'remove').mockResolvedValue(null);
      await expect(controller.remove('1')).rejects.toThrowError('Failed to delete user');
    });

    it('should throw an error if deletion fails', async () => {
      jest.spyOn(mockUserService, 'remove').mockRejectedValue(new Error('Deletion error'));
      await expect(controller.remove('1')).rejects.toThrowError('Failed to delete user');
    });
  });
});
