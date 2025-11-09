require('dotenv').config();
const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const connectDB = require('../config/database');

// Import tools data from frontend mockData
const toolsData = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, analysis, and creative tasks',
    longDescription: 'ChatGPT is a state-of-the-art language model developed by OpenAI that can engage in natural conversations, help with writing, coding, analysis, and creative tasks. It uses advanced AI to understand context and provide intelligent, helpful responses.',
    category: 'text-generation',
    developer: 'OpenAI',
    rating: 4.8,
    totalRatings: 125400,
    size: '45 MB',
    price: 'Freemium',
    actualPrice: '$20/month Pro',
    tags: ['Writing', 'Chat', 'Analysis', 'Popular'],
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    screenshots: [],
    featured: true,
    trending: "Editor's Pick",
    downloadCount: '100M+',
    lastUpdated: 'Oct 1, 2024',
    version: '4.0',
    features: ['API Access', 'Custom Training', 'Team Collaboration', 'Multi-language Support', 'Data Export'],
    integrations: ['Slack', 'Discord', 'Microsoft 365', 'Zapier', 'REST API'],
    website: 'https://chat.openai.com',
    demoUrl: 'https://chat.openai.com'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI art generator creating stunning images from text descriptions',
    longDescription: 'Midjourney is an AI-powered image generation tool that creates beautiful, artistic images from text prompts. Perfect for designers, artists, and anyone looking to create unique visual content.',
    category: 'image-generation',
    developer: 'Midjourney',
    rating: 4.7,
    totalRatings: 89300,
    size: 'Web-based',
    price: 'Paid',
    actualPrice: '$10-60/month',
    tags: ['Art', 'Design', 'Images', 'Creative'],
    icon: 'https://cdn.midjourney.com/favicon.ico',
    screenshots: [],
    featured: true,
    trending: 'Rising',
    downloadCount: '5M+',
    lastUpdated: 'Sep 28, 2024',
    version: '6.0',
    features: ['High Resolution', 'Style Transfer', 'Batch Processing', 'Commercial License', 'Community Gallery'],
    integrations: ['Discord', 'Web Interface'],
    website: 'https://www.midjourney.com',
    demoUrl: 'https://www.midjourney.com/showcase'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster',
    longDescription: 'GitHub Copilot is an AI coding assistant that suggests code and entire functions in real-time, right from your editor. Trained on billions of lines of code, it turns natural language prompts into coding suggestions across dozens of languages.',
    category: 'code-generation',
    developer: 'GitHub',
    rating: 4.6,
    totalRatings: 67800,
    size: '120 MB',
    price: 'Freemium',
    actualPrice: '$10/month',
    tags: ['Coding', 'Programming', 'Developer Tools'],
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    screenshots: [],
    featured: true,
    trending: "Editor's Pick",
    downloadCount: '10M+',
    lastUpdated: 'Oct 5, 2024',
    version: '1.5',
    features: ['Multi-language Support', 'IDE Integration', 'Code Suggestions', 'Documentation Generation', 'Test Generation'],
    integrations: ['VS Code', 'Visual Studio', 'JetBrains IDEs', 'Neovim'],
    website: 'https://github.com/features/copilot',
    demoUrl: 'https://github.com/features/copilot'
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Advanced AI assistant by Anthropic for complex tasks and analysis',
    longDescription: 'Claude is an AI assistant created by Anthropic that excels at complex reasoning, analysis, and following detailed instructions. It\'s designed to be helpful, harmless, and honest.',
    category: 'text-generation',
    developer: 'Anthropic',
    rating: 4.7,
    totalRatings: 45600,
    size: 'Web-based',
    price: 'Freemium',
    actualPrice: '$20/month Pro',
    tags: ['AI Assistant', 'Analysis', 'Writing', 'Research'],
    icon: 'https://claude.ai/favicon.ico',
    screenshots: [],
    featured: true,
    trending: 'New',
    downloadCount: '2M+',
    lastUpdated: 'Oct 3, 2024',
    version: '3.0',
    features: ['Long Context', 'File Analysis', 'Code Generation', 'Multi-turn Conversations', 'API Access'],
    integrations: ['Slack', 'API', 'Web Interface'],
    website: 'https://claude.ai',
    demoUrl: 'https://claude.ai'
  },
  {
    id: 'dall-e',
    name: 'DALL·E 3',
    description: 'OpenAI\'s advanced AI system for creating realistic images from text',
    longDescription: 'DALL·E 3 is OpenAI\'s latest image generation model that creates highly detailed and accurate images from natural language descriptions. It understands nuance and detail to bring your ideas to life.',
    category: 'image-generation',
    developer: 'OpenAI',
    rating: 4.6,
    totalRatings: 72100,
    size: 'Web-based',
    price: 'Paid',
    actualPrice: '$15-30/month',
    tags: ['Images', 'Art', 'Design', 'Creative'],
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    screenshots: [],
    featured: true,
    trending: "Editor's Pick",
    downloadCount: '8M+',
    lastUpdated: 'Sep 25, 2024',
    version: '3.0',
    features: ['High Resolution', 'Style Control', 'Image Editing', 'Variations', 'Commercial Use'],
    integrations: ['ChatGPT', 'API', 'Bing Image Creator'],
    website: 'https://openai.com/dall-e-3',
    demoUrl: 'https://chat.openai.com'
  }
];

// ==================== SEED DATABASE ====================
const seedTools = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting database seeding...');
    console.log('='.repeat(50));

    // Clear existing tools
    const deleteResult = await Tool.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing tools`);

    // Insert new tools
    const tools = await Tool.insertMany(toolsData);
    console.log(`✅ Successfully seeded ${tools.length} tools`);

    console.log('='.repeat(50));
    console.log('🎉 Database seeding complete!');
    console.log('\nSample tools added:');
    tools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} (${tool.category})`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// ==================== RUN SEEDING ====================
seedTools();
