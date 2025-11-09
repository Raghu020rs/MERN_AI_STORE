// User Model Tests
// Testing user creation, validation, and password security

const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a valid user with strong password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongP@ss123',
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should hash password before saving', async () => {
      const password = 'TestP@ss123';
      const user = await User.create({
        name: 'Test User',
        email: 'hash@example.com',
        password,
      });

      // Password should be hashed
      expect(user.password).not.toBe(password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern

      // Should be able to verify password
      const isMatch = await bcrypt.compare(password, user.password);
      expect(isMatch).toBe(true);
    });

    it('should create user with default avatar', async () => {
      const user = await User.create({
        name: 'Avatar Test',
        email: 'avatar@example.com',
        password: 'StrongP@ss123',
      });

      expect(user.avatar).toBeDefined();
      expect(user.avatar).toContain('dicebear.com');
    });

    it('should set default role to "user"', async () => {
      const user = await User.create({
        name: 'Role Test',
        email: 'role@example.com',
        password: 'StrongP@ss123',
      });

      expect(user.role).toBe('user');
    });
  });

  describe('Password Validation', () => {
    it('should reject password shorter than 8 characters', async () => {
      const userData = {
        name: 'Test User',
        email: 'short@example.com',
        password: 'Pass1!', // Only 6 characters
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject password without uppercase letter', async () => {
      const userData = {
        name: 'Test User',
        email: 'noupper@example.com',
        password: 'password123!', // No uppercase
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject password without lowercase letter', async () => {
      const userData = {
        name: 'Test User',
        email: 'nolower@example.com',
        password: 'PASSWORD123!', // No lowercase
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject password without number', async () => {
      const userData = {
        name: 'Test User',
        email: 'nonumber@example.com',
        password: 'Password!', // No number
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should reject password without special character', async () => {
      const userData = {
        name: 'Test User',
        email: 'nospecial@example.com',
        password: 'Password123', // No special character
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should accept password with all requirements', async () => {
      const validPasswords = [
        'StrongP@ss123',
        'MyP@ssw0rd',
        'Secure$2024',  // Changed # to $ (allowed character)
        'Test@123Pass',
      ];

      for (const password of validPasswords) {
        const user = await User.create({
          name: 'Test User',
          email: `valid${Math.random()}@example.com`,
          password,
        });

        expect(user).toBeDefined();
      }
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test@.com',
      ];

      for (const email of invalidEmails) {
        await expect(
          User.create({
            name: 'Test User',
            email,
            password: 'StrongP@ss123',
          })
        ).rejects.toThrow();
      }
    });

    it('should convert email to lowercase', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'StrongP@ss123',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should reject duplicate emails', async () => {
      const email = 'duplicate@example.com';

      await User.create({
        name: 'User 1',
        email,
        password: 'StrongP@ss123',
      });

      await expect(
        User.create({
          name: 'User 2',
          email,
          password: 'StrongP@ss123',
        })
      ).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Method Test',
        email: 'methods@example.com',
        password: 'StrongP@ss123',
      });
    });

    it('should generate access token', () => {
      const token = user.generateAccessToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate refresh token', () => {
      const token = user.generateRefreshToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should throw error if JWT_SECRET is not defined', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      expect(() => user.generateAccessToken()).toThrow('JWT_SECRET is not defined');

      process.env.JWT_SECRET = originalSecret;
    });

    it('should match correct password', async () => {
      const password = 'StrongP@ss123';
      const testUser = await User.create({
        name: 'Password Match Test',
        email: 'match@example.com',
        password,
      });

      // Get user with password field (it's excluded by default)
      const userWithPassword = await User.findById(testUser._id).select('+password');
      const isMatch = await bcrypt.compare(password, userWithPassword.password);

      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const password = 'StrongP@ss123';
      const wrongPassword = 'WrongP@ss123';

      const testUser = await User.create({
        name: 'Password Mismatch Test',
        email: 'mismatch@example.com',
        password,
      });

      const userWithPassword = await User.findById(testUser._id).select('+password');
      const isMatch = await bcrypt.compare(wrongPassword, userWithPassword.password);

      expect(isMatch).toBe(false);
    });
  });

  describe('Required Fields', () => {
    it('should require name', async () => {
      await expect(
        User.create({
          email: 'noname@example.com',
          password: 'StrongP@ss123',
        })
      ).rejects.toThrow();
    });

    it('should require email', async () => {
      await expect(
        User.create({
          name: 'Test User',
          password: 'StrongP@ss123',
        })
      ).rejects.toThrow();
    });

    it('should require password', async () => {
      await expect(
        User.create({
          name: 'Test User',
          email: 'nopassword@example.com',
        })
      ).rejects.toThrow();
    });
  });
});
