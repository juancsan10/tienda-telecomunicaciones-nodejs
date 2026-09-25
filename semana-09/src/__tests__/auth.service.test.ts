// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================
// Adaptado del ejercicio 01. Mockeamos users.repository completo.
// ============================================================

jest.mock('../repositories/users.repository');

import bcrypt from 'bcryptjs';
import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';
import { AppError } from '../errors/AppError';
import type { IUser } from '../models/user.model';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<typeof usersRepo.findUserByEmail>;
const mockCreateUser  = usersRepo.createUser as jest.MockedFunction<typeof usersRepo.createUser>;
const mockFindById    = usersRepo.findUserById as jest.MockedFunction<typeof usersRepo.findUserById>;

describe('AuthService — Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    const dto = { name: 'Alice', email: 'alice@test.com', password: 'Password1' };

    it('should create a user when email is not taken', async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockCreateUser.mockResolvedValue({
        _id: 'user-id-123',
        name: dto.name,
        email: dto.email,
        password: 'hashed',
        role: 'user',
      } as unknown as IUser);

      const result = await authService.register(dto);

      expect(mockFindByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockCreateUser).toHaveBeenCalledTimes(1);
      expect(result['email']).toBe(dto.email);
      expect(result['password']).toBeUndefined();
    });

    it('should throw AppError 409 when email is already registered', async () => {
      mockFindByEmail.mockResolvedValue({ email: dto.email } as unknown as IUser);

      await expect(authService.register(dto)).rejects.toMatchObject({ statusCode: 409 });
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should return an accessToken when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('Password1', 1);
      mockFindByEmail.mockResolvedValue({
        _id: 'user-id-123',
        email: 'alice@test.com',
        password: hashedPassword,
        role: 'user',
      } as unknown as IUser);

      const result = await authService.login({ email: 'alice@test.com', password: 'Password1' });

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });

    it('should throw AppError 401 when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword1', 1);
      mockFindByEmail.mockResolvedValue({
        _id: 'user-id-123',
        email: 'alice@test.com',
        password: hashedPassword,
        role: 'user',
      } as unknown as IUser);

      await expect(
        authService.login({ email: 'alice@test.com', password: 'WrongPassword1' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw AppError 401 when user does not exist', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noone@test.com', password: 'Password1' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('getMe()', () => {
    it('should return the user without password', async () => {
      mockFindById.mockResolvedValue({
        _id: 'user-id-123',
        name: 'Alice',
        email: 'alice@test.com',
        password: 'hashed',
        role: 'user',
      } as unknown as IUser);

      const result = await authService.getMe('user-id-123');

      expect(result['email']).toBe('alice@test.com');
      expect(result['password']).toBeUndefined();
    });

    it('should throw AppError 404 when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(authService.getMe('nope')).rejects.toThrow(AppError);
      await expect(authService.getMe('nope')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
