const mongoose = require('mongoose');
const Tool = require('../../models/Tool');
const User = require('../../models/User');

describe('Tool Model', () => {
  let testUser;

  beforeAll(async () => {
    // Create a test user for tool submissions
    testUser = await User.create({
      name: 'Tool Tester',
      email: 'tooltester@example.com',
      password: 'ToolTest@123',
    });
  });

  afterEach(async () => {
    // Clean up tools after each test
    await Tool.deleteMany({});
  });

  describe('Tool Creation', () => {
    it('should create a valid tool with required fields', async () => {
      const toolData = {
        id: 'chatgpt-tool',
        name: 'ChatGPT',
        description: 'Advanced AI language model',
        category: 'text-generation',
        website: 'https://chat.openai.com',
        developer: 'OpenAI',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      const tool = await Tool.create(toolData);

      expect(tool).toBeTruthy();
      expect(tool.name).toBe(toolData.name);
      expect(tool.description).toBe(toolData.description);
      expect(tool.category).toBe(toolData.category);
      expect(tool.website).toBe(toolData.website);
      expect(tool.developer).toBe(toolData.developer);
    });

    it('should create tool with all optional fields', async () => {
      const toolData = {
        id: 'advanced-tool',
        name: 'Advanced Tool',
        description: 'A comprehensive AI tool',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Tech Company',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
        demoUrl: 'https://example.com/demo',
        videoUrl: 'https://example.com/video',
        screenshots: ['https://example.com/screenshot1.png'],
        tags: ['AI', 'ML', 'NLP'],
      };

      const tool = await Tool.create(toolData);

      expect(tool.icon).toBe(toolData.icon);
      expect(tool.developer).toBe(toolData.developer);
      expect(tool.demoUrl).toBe(toolData.demoUrl);
      expect(tool.videoUrl).toBe(toolData.videoUrl);
      expect(tool.screenshots).toEqual(toolData.screenshots);
      expect(tool.tags).toEqual(toolData.tags);
    });

    it('should set default values correctly', async () => {
      const toolData = {
        id: 'simple-tool',
        name: 'Simple Tool',
        description: 'A simple tool',
        category: 'productivity',
        website: 'https://example.com',
        developer: 'Developer Name',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      const tool = await Tool.create(toolData);

      expect(tool.price).toBe('Freemium');
      expect(tool.pricingModel).toBe('freemium');
    });
  });

  describe('Required Fields Validation', () => {
    it('should require name field', async () => {
      const toolData = {
        id: 'test-tool',
        description: 'Missing name',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should require description field', async () => {
      const toolData = {
        id: 'test-tool',
        name: 'Tool Name',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should require category field', async () => {
      const toolData = {
        id: 'test-tool',
        name: 'Tool Name',
        description: 'Tool description',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should require website field', async () => {
      const toolData = {
        id: 'test-tool',
        name: 'Tool Name',
        description: 'Tool description',
        category: 'text-generation',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should require id field', async () => {
      const toolData = {
        name: 'Tool Name',
        description: 'Tool description',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });
  });

  describe('Field Validation', () => {
    it('should allow short name (no minlength in model)', async () => {
      const tool = await Tool.create({
        id: 'ab',
        name: 'AB',
        description: 'Tool description',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
      });

      expect(tool.name).toBe('AB');
    });

    it('should enforce maximum name length (100 characters)', async () => {
      const toolData = {
        id: 'long-name-tool',
        name: 'A'.repeat(101), // Too long
        description: 'Tool description',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should enforce maximum description length (500 characters)', async () => {
      const toolData = {
        id: 'long-desc',
        name: 'Tool Name',
        description: 'A'.repeat(501), // Too long
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should accept any string for website (no URL validation in model)', async () => {
      const tool = await Tool.create({
        id: 'any-url',
        name: 'Tool Name',
        description: 'Valid description',
        category: 'text-generation',
        website: 'not-a-url', // Model doesn't validate URL format
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
      });

      expect(tool.website).toBe('not-a-url');
    });

    it('should accept valid http and https URLs', async () => {
      const httpTool = await Tool.create({
        id: 'http-tool',
        name: 'HTTP Tool',
        description: 'A tool with HTTP website URL',
        category: 'text-generation',
        website: 'http://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      const httpsTool = await Tool.create({
        id: 'https-tool',
        name: 'HTTPS Tool',
        description: 'A tool with HTTPS website URL',
        category: 'productivity',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      expect(httpTool.website).toBe('http://example.com');
      expect(httpsTool.website).toBe('https://example.com');
    });
  });

  describe('Status Validation', () => {
    it('should only allow valid status values', async () => {
      const validStatuses = ['active', 'deprecated', 'beta', 'coming-soon'];

      for (const status of validStatuses) {
        const tool = await Tool.create({
          id: `tool-${status}`,
          name: `Tool ${status}`,
          description: 'Tool description for status test',
          category: 'text-generation',
          website: 'https://example.com',
          developer: 'Developer',
          icon: 'https://example.com/icon.png',
          submittedBy: testUser._id,
          status,
        });

        expect(tool.status).toBe(status);
        await Tool.deleteOne({ _id: tool._id });
      }
    });

    it('should reject invalid status values', async () => {
      const toolData = {
        id: 'invalid-status',
        name: 'Invalid Status Tool',
        description: 'Tool with invalid status',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
        status: 'invalid_status',
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });
  });

  describe('Rating Validation', () => {
    it('should enforce minimum rating (0)', async () => {
      const toolData = {
        id: 'low-rating',
        name: 'Low Rating Tool',
        description: 'Tool with negative rating',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
        rating: -1, // Below minimum
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should enforce maximum rating (5)', async () => {
      const toolData = {
        id: 'high-rating',
        name: 'High Rating Tool',
        description: 'Tool with rating above maximum',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
        rating: 6, // Above maximum
      };

      await expect(Tool.create(toolData)).rejects.toThrow();
    });

    it('should accept valid ratings between 0 and 5', async () => {
      const ratings = [0, 1, 2.5, 3.7, 4.2, 5];

      for (const rating of ratings) {
        const tool = await Tool.create({
          id: `tool-rating-${rating}`,
          name: `Tool Rating ${rating}`,
          description: 'Tool with valid rating value',
          category: 'text-generation',
          website: 'https://example.com',
          developer: 'Developer',
          icon: 'https://example.com/icon.png',
          submittedBy: testUser._id,
          rating,
        });

        expect(tool.rating).toBe(rating);
        await Tool.deleteOne({ _id: tool._id });
      }
    });
  });

  describe('Timestamps', () => {
    it('should automatically create timestamps', async () => {
      const tool = await Tool.create({
        id: 'timestamp-tool',
        name: 'Timestamp Tool',
        description: 'Tool to test timestamps',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      expect(tool.createdAt).toBeDefined();
      expect(tool.updatedAt).toBeDefined();
      expect(tool.createdAt).toBeInstanceOf(Date);
      expect(tool.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const tool = await Tool.create({
        id: 'update-tool',
        name: 'Update Tool',
        description: 'Tool to test update timestamp',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      const originalUpdatedAt = tool.updatedAt;

      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update the tool
      tool.name = 'Updated Tool Name';
      await tool.save();

      expect(tool.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Virtual Properties', () => {
    it('should have id virtual property', async () => {
      const tool = await Tool.create({
        id: 'virtual-id-tool',
        name: 'Virtual ID Tool',
        description: 'Tool to test virtual ID property',
        category: 'text-generation',
        website: 'https://example.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      const toolJSON = tool.toJSON();
      expect(toolJSON.id).toBeDefined();
    });
  });

  describe('Indexing', () => {
    it('should create unique index on id field', async () => {
      await Tool.create({
        id: 'unique-tool',
        name: 'Unique Tool',
        description: 'First tool with this ID',
        category: 'text-generation',
        website: 'https://example1.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      });

      // Try to create another tool with the same id
      await expect(Tool.create({
        id: 'unique-tool',
        name: 'Another Unique Tool',
        description: 'Second tool with same ID',
        category: 'productivity',
        website: 'https://example2.com',
        developer: 'Developer',
        icon: 'https://example.com/icon.png',
        submittedBy: testUser._id,
      })).rejects.toThrow();
    });
  });
});
