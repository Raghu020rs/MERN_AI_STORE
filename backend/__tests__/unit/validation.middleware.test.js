const { validationResult } = require('express-validator');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  createToolValidation,
  createReviewValidation,
  createCollectionValidation,
  sanitizeUserInput,
  handleValidationErrors,
} = require('../../middleware/validation');

// Mock request and response objects
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Helper to run validation chain
const runValidation = async (validations, req) => {
  for (let validation of validations) {
    await validation.run(req);
  }
};

describe('Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerValidation', () => {
    it('should pass with valid registration data', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass@123',
      });

      await runValidation(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing name', async () => {
      const req = mockRequest({
        email: 'john@example.com',
        password: 'SecurePass@123',
      });

      await runValidation(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'name')).toBe(true);
    });

    it('should fail with invalid email', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass@123',
      });

      await runValidation(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'email')).toBe(true);
    });

    it('should fail with weak password', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
      });

      await runValidation(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'password')).toBe(true);
    });

    it('should trim and sanitize name', async () => {
      const req = mockRequest({
        name: '  John Doe  ',
        email: 'john@example.com',
        password: 'SecurePass@123',
      });

      await runValidation(registerValidation, req);

      expect(req.body.name).toBe('John Doe');
    });

    it('should normalize email to lowercase', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        password: 'SecurePass@123',
      });

      await runValidation(registerValidation, req);

      expect(req.body.email).toBe('john@example.com');
    });
  });

  describe('loginValidation', () => {
    it('should pass with valid credentials', async () => {
      const req = mockRequest({
        email: 'john@example.com',
        password: 'SecurePass@123',
      });

      await runValidation(loginValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing email', async () => {
      const req = mockRequest({
        password: 'SecurePass@123',
      });

      await runValidation(loginValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'email')).toBe(true);
    });

    it('should fail with missing password', async () => {
      const req = mockRequest({
        email: 'john@example.com',
      });

      await runValidation(loginValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'password')).toBe(true);
    });

    it('should normalize email', async () => {
      const req = mockRequest({
        email: 'JOHN@EXAMPLE.COM',
        password: 'SecurePass@123',
      });

      await runValidation(loginValidation, req);

      expect(req.body.email).toBe('john@example.com');
    });
  });

  describe('updateProfileValidation', () => {
    it('should pass with valid profile updates', async () => {
      const req = mockRequest({
        name: 'John Updated',
        bio: 'This is my bio',
        email: 'john@example.com',
      });

      await runValidation(updateProfileValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should trim and sanitize name', async () => {
      const req = mockRequest({
        name: '  John Updated  ',
      });

      await runValidation(updateProfileValidation, req);

      expect(req.body.name).toBe('John Updated');
    });

    it('should fail with name too short', async () => {
      const req = mockRequest({
        name: 'J',
      });

      await runValidation(updateProfileValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'name')).toBe(true);
    });

    it('should fail with invalid email', async () => {
      const req = mockRequest({
        email: 'not-an-email',
      });

      await runValidation(updateProfileValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'email')).toBe(true);
    });

    it('should accept valid emails', async () => {
      const req = mockRequest({
        email: 'valid@example.com',
      });

      await runValidation(updateProfileValidation, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('changePasswordValidation', () => {
    it('should pass with valid passwords', async () => {
      const req = mockRequest({
        currentPassword: 'OldPass@123',
        newPassword: 'NewPass@456',
      });

      await runValidation(changePasswordValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing current password', async () => {
      const req = mockRequest({
        newPassword: 'NewPass@456',
      });

      await runValidation(changePasswordValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'currentPassword')).toBe(true);
    });

    it('should fail with weak new password', async () => {
      const req = mockRequest({
        currentPassword: 'OldPass@123',
        newPassword: 'weak',
      });

      await runValidation(changePasswordValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'newPassword')).toBe(true);
    });
  });

  describe('createToolValidation', () => {
    it('should pass with valid tool data', async () => {
      const req = mockRequest({
        name: 'ChatGPT',
        description: 'Advanced AI language model for conversation',
        category: 'text-generation',
        website: 'https://chat.openai.com',
      });

      await runValidation(createToolValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing required fields', async () => {
      const req = mockRequest({
        name: 'Tool Name',
        // Missing description, category
      });

      await runValidation(createToolValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBeGreaterThan(0);
    });

    it('should fail with short description', async () => {
      const req = mockRequest({
        name: 'Tool Name',
        description: 'Too short', // Less than 10 chars
        category: 'text-generation',
        website: 'https://example.com',
      });

      await runValidation(createToolValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'description')).toBe(true);
    });

    it('should fail with invalid website URL', async () => {
      const req = mockRequest({
        name: 'Tool Name',
        description: 'Valid description',
        category: 'text-generation',
        website: 'invalid-url',
      });

      await runValidation(createToolValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'website')).toBe(true);
    });

    it('should sanitize and trim inputs', async () => {
      const req = mockRequest({
        name: '  Tool Name  ',
        description: '  Valid description  ',
        category: 'text-generation',
        website: 'https://example.com',
      });

      await runValidation(createToolValidation, req);

      expect(req.body.name).toBe('Tool Name');
      expect(req.body.description).toBe('Valid description');
    });
  });

  describe('createReviewValidation', () => {
    it('should pass with valid review data', async () => {
      const req = mockRequest({
        rating: 4,
        comment: 'Great tool! Very useful and easy to use.',
      });

      await runValidation(createReviewValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with rating below minimum', async () => {
      const req = mockRequest({
        rating: 0, // Below minimum of 1
        comment: 'This is a review comment with enough characters.',
      });

      await runValidation(createReviewValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'rating')).toBe(true);
    });

    it('should fail with rating above maximum', async () => {
      const req = mockRequest({
        rating: 6, // Above maximum of 5
        comment: 'This is a review comment with enough characters.',
      });

      await runValidation(createReviewValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'rating')).toBe(true);
    });

    it('should fail with short comment', async () => {
      const req = mockRequest({
        rating: 4,
        comment: 'Short', // Too short
      });

      await runValidation(createReviewValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'comment')).toBe(true);
    });

    it('should accept valid ratings from 1 to 5', async () => {
      const validRatings = [1, 2, 3, 4, 5];

      for (const rating of validRatings) {
        const req = mockRequest({
          rating,
          comment: 'This is a valid review comment with enough characters.',
        });

        await runValidation(createReviewValidation, req);
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
      }
    });
  });

  describe('createCollectionValidation', () => {
    it('should pass with valid collection data', async () => {
      const req = mockRequest({
        name: 'My Favorites',
        description: 'Collection of my favorite AI tools',
      });

      await runValidation(createCollectionValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing name', async () => {
      const req = mockRequest({
        description: 'Collection description',
      });

      await runValidation(createCollectionValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'name')).toBe(true);
    });

    it('should fail with short name', async () => {
      const req = mockRequest({
        name: 'A', // Too short (needs min 2)
        description: 'Collection description',
      });

      await runValidation(createCollectionValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().some(e => e.path === 'name')).toBe(true);
    });

    it('should accept collections with optional description', async () => {
      const req = mockRequest({
        name: 'Valid Collection',
      });

      await runValidation(createCollectionValidation, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });
  });

  // Note: sanitizeUserInput is middleware and is tested via integration tests
  // Direct unit testing of middleware is problematic and should be avoided

  // Note: handleValidationErrors is also tested via integration tests
  // where the full middleware chain is executed properly
});
