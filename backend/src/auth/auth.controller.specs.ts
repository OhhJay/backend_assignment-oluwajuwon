import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { loginRequest } from './dto/login.interface';

// Mock service
const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    token: 'generatedToken',
    access_token: 'generatedToken',
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      const loginData: loginRequest = {
        email: 'john.doe@example.com',
        password: 'hashedpassword',
      };
      const result = await controller.login(loginData);
      expect(result).toEqual({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        token: 'generatedToken',
        access_token: 'generatedToken',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
    });

    it('should handle errors from AuthService', async () => {
      jest.spyOn(mockAuthService, 'login').mockRejectedValue(new Error('Login failed'));
      const loginData: loginRequest = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };
      await expect(controller.login(loginData)).rejects.toThrowError('Login failed');
    });
  });
});
