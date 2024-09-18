import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { user } from '@prisma/client';
import { config } from 'src/utils/config';

// Mock data
const mockUser: user = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
  token: 'existingtoken',
};

// Mock services
const mockJwtService = {
  sign: jest.fn().mockReturnValue('generatedToken'),
};

const mockUserService = {
  validateUser: jest.fn().mockResolvedValue(mockUser),
};

const mockPrisma = {
  user: {
    update: jest.fn().mockResolvedValue({
      ...mockUser,
      token: 'generatedToken',
    }),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: PrismaDatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const result = await service.validateUser('john.doe@example.com', 'hashedpassword');
      expect(result).toEqual(mockUser);
      expect(mockUserService.validateUser).toHaveBeenCalledWith('john.doe@example.com', 'hashedpassword');
    });

    it('should return null if user credentials are invalid', async () => {
      jest.spyOn(mockUserService, 'validateUser').mockResolvedValue(null);
      const result = await service.validateUser('john.doe@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token and updated user data', async () => {
      const loginData = { email: 'john.doe@example.com', password: 'hashedpassword' };
      const result = await service.login(loginData);
      expect(result).toEqual({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        token: 'generatedToken',
        access_token: 'generatedToken',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email: mockUser.email, sub: mockUser.id },
        { secret: config.jwt.secret }
      );
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { token: 'generatedToken' },
      });
    });

    it('should return an error message if credentials are invalid', async () => {
      jest.spyOn(mockUserService, 'validateUser').mockResolvedValue(null);
      const loginData = { email: 'wrong.email@example.com', password: 'wrongpassword' };
      const result = await service.login(loginData);
      expect(result).toEqual({
        status: 400,
        message: 'Invalid Login Credentials',
      });
    });

    it('should handle errors from user update', async () => {
      jest.spyOn(mockPrisma.user, 'update').mockRejectedValue(new Error('Update failed'));
      const loginData = { email: 'john.doe@example.com', password: 'hashedpassword' };
      await expect(service.login(loginData)).rejects.toThrowError('Update failed');
    });
  });
});
