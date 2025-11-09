require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const connectDB = require('../config/database');

// ==================== READ FRONTEND MOCKDATA ====================
const readMockDataTools = () => {
  console.log('📖 Reading tools from frontend mockData.ts...');
  
  // Path to frontend mockData
  const mockDataPath = path.join(__dirname, '../../src/data/mockData.ts');
  
  if (!fs.existsSync(mockDataPath)) {
    console.error('❌ mockData.ts not found at:', mockDataPath);
    console.log('💡 Using sample data instead...');
    return getSampleTools();
  }

  try {
    const content = fs.readFileSync(mockDataPath, 'utf8');
    
    // Extract aiTools array (basic parsing - you can make this more sophisticated)
    const aiToolsMatch = content.match(/export const aiTools: AITool\[\] = (\[[\s\S]*?\n\]);/);
    const moreAIToolsMatch = content.match(/const moreAITools: AITool\[\] = (\[[\s\S]*?\n\]);/);
    
    if (!aiToolsMatch && !moreAIToolsMatch) {
      console.log('⚠️  Could not parse mockData.ts, using sample data...');
      return getSampleTools();
    }

    console.log('✅ Found tools in mockData.ts');
    console.log('💡 Note: Using sample data for now. Run full import script for all 3000+ tools');
    
    // For now, return sample data
    // To import ALL tools, you'd need to:
    // 1. Convert TypeScript to JSON
    // 2. Or manually create a JSON file with all tools
    return getSampleTools();
    
  } catch (error) {
    console.error('❌ Error reading mockData:', error.message);
    return getSampleTools();
  }
};

// ==================== SAMPLE TOOLS DATA ====================
const getSampleTools = () => {
  return [
    {
      id: 'chatgpt',
      slug: 'chatgpt',
      name: 'ChatGPT',
      description: 'Advanced conversational AI for writing, analysis, and creative tasks',
      longDescription: 'ChatGPT is a state-of-the-art language model developed by OpenAI that can engage in natural conversations, help with writing, coding, analysis, and creative tasks.',
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
      id: 'claude',
      slug: 'claude',
      name: 'Claude AI',
      description: 'Constitutional AI assistant for safe and helpful conversations',
      longDescription: 'Claude is an AI assistant created by Anthropic that prioritizes safety, helpfulness, and honesty. It excels at complex reasoning, creative writing, coding, and detailed analysis.',
      category: 'text-generation',
      developer: 'Anthropic',
      rating: 4.7,
      totalRatings: 89300,
      size: '38 MB',
      price: 'Freemium',
      actualPrice: '$20/month Pro',
      tags: ['Assistant', 'Analysis', 'Safe AI', 'Writing'],
      icon: 'https://claude.ai/favicon.ico',
      screenshots: [],
      featured: true,
      trending: "Editor's Pick",
      downloadCount: '50M+',
      lastUpdated: 'Oct 5, 2024',
      version: '3.5',
      features: ['API Access', 'Custom Training', 'Analytics & Insights', 'Multi-language Support'],
      integrations: ['Slack', 'Google Workspace', 'Notion', 'Zapier', 'REST API'],
      website: 'https://claude.ai',
      demoUrl: 'https://claude.ai'
    },
    {
      id: 'gemini',
      slug: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s most capable AI model for multimodal understanding',
      longDescription: 'Gemini is Google\'s most advanced AI model, capable of understanding and generating text, images, audio, and code.',
      category: 'text-generation',
      developer: 'Google',
      rating: 4.6,
      totalRatings: 78900,
      size: '52 MB',
      price: 'Freemium',
      actualPrice: '$19.99/month Pro',
      tags: ['Multimodal', 'Google', 'Analysis', 'Assistant'],
      icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
      screenshots: [],
      featured: true,
      trending: 'Rising',
      downloadCount: '75M+',
      lastUpdated: 'Oct 6, 2024',
      version: '1.5',
      features: ['API Access', 'Multi-language Support', 'Mobile App', 'Analytics & Insights'],
      integrations: ['Google Workspace', 'Gmail', 'Google Drive', 'REST API'],
      website: 'https://gemini.google.com',
      demoUrl: 'https://gemini.google.com'
    },
    {
      id: 'midjourney',
      slug: 'midjourney',
      name: 'Midjourney',
      description: 'AI-powered image generation from text prompts',
      longDescription: 'Midjourney is a leading AI image generation tool that creates stunning, artistic images from text descriptions.',
      category: 'image-generation',
      developer: 'Midjourney Inc.',
      rating: 4.7,
      totalRatings: 89300,
      size: '120 MB',
      price: 'Paid',
      actualPrice: '$10/month',
      tags: ['Art', 'Design', 'Creative'],
      icon: 'https://www.midjourney.com/favicon.ico',
      screenshots: [],
      featured: true,
      trending: 'Rising',
      downloadCount: '50M+',
      lastUpdated: 'Sep 28, 2024',
      version: '6.0',
      features: ['API Access', 'Custom Training', 'Team Collaboration', 'White Label'],
      integrations: ['Discord', 'REST API'],
      website: 'https://www.midjourney.com',
      demoUrl: 'https://www.midjourney.com/home'
    },
    {
      id: 'github-copilot',
      slug: 'github-copilot',
      name: 'GitHub Copilot',
      description: 'AI-powered code completion and programming assistant',
      longDescription: 'GitHub Copilot is your AI pair programmer. It helps you write code faster with AI-powered code completions, suggestions, and chat assistance.',
      category: 'code-generation',
      developer: 'GitHub',
      rating: 4.5,
      totalRatings: 45600,
      size: '85 MB',
      price: 'Paid',
      actualPrice: '$10/month',
      tags: ['Coding', 'Programming', 'Developer'],
      icon: 'https://github.githubassets.com/favicons/favicon.svg',
      screenshots: [],
      trending: 'New',
      downloadCount: '15M+',
      lastUpdated: 'Oct 3, 2024',
      version: '1.8',
      features: ['Code Completion', 'Chat Interface', 'Multi-language Support'],
      integrations: ['GitHub', 'VS Code', 'JetBrains', 'Neovim'],
      website: 'https://github.com/features/copilot',
      demoUrl: 'https://github.com/features/copilot'
    },
    {
      id: 'dall-e-3',
      slug: 'dall-e-3',
      name: 'DALL-E 3',
      description: 'OpenAI\'s most advanced image generation system',
      longDescription: 'DALL-E 3 is OpenAI\'s latest image generation model that creates highly detailed and accurate images from natural language descriptions.',
      category: 'image-generation',
      developer: 'OpenAI',
      rating: 4.6,
      totalRatings: 67800,
      size: 'Web-based',
      price: 'Paid',
      actualPrice: 'Included with ChatGPT Plus',
      tags: ['Images', 'Art', 'Design', 'Creative'],
      icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
      screenshots: [],
      featured: true,
      trending: "Editor's Pick",
      downloadCount: '30M+',
      lastUpdated: 'Sep 25, 2024',
      version: '3.0',
      features: ['High Resolution', 'Style Control', 'Image Editing', 'Variations'],
      integrations: ['ChatGPT', 'API', 'Bing Image Creator'],
      website: 'https://openai.com/dall-e-3',
      demoUrl: 'https://chat.openai.com'
    },
    {
      id: 'runway-ml',
      slug: 'runway-ml',
      name: 'Runway ML',
      description: 'AI video editing and generation platform',
      longDescription: 'Runway ML is a creative suite powered by AI that helps filmmakers, content creators, and artists create stunning videos with AI-powered tools.',
      category: 'video-generation',
      developer: 'Runway',
      rating: 4.4,
      totalRatings: 34200,
      size: '156 MB',
      price: 'Freemium',
      actualPrice: '$15/month Pro',
      tags: ['Video', 'Editing', 'Generation', 'Creative'],
      icon: 'https://runwayml.com/favicon.ico',
      screenshots: [],
      downloadCount: '8M+',
      lastUpdated: 'Sep 30, 2024',
      version: '2.1',
      features: ['Video Generation', 'AI Editing', 'Image Tools', 'API Access'],
      integrations: ['Adobe', 'Final Cut Pro', 'REST API'],
      website: 'https://runwayml.com',
      demoUrl: 'https://runwayml.com'
    },
    {
      id: 'perplexity',
      slug: 'perplexity',
      name: 'Perplexity AI',
      description: 'AI-powered search engine and answer assistant',
      longDescription: 'Perplexity AI is an advanced AI search engine that provides accurate, real-time answers with cited sources.',
      category: 'text-generation',
      developer: 'Perplexity AI',
      rating: 4.6,
      totalRatings: 56700,
      size: '35 MB',
      price: 'Freemium',
      actualPrice: '$20/month Pro',
      tags: ['Search', 'Research', 'Assistant', 'Real-time'],
      icon: 'https://www.perplexity.ai/favicon.ico',
      screenshots: [],
      featured: true,
      trending: 'Rising',
      downloadCount: '30M+',
      lastUpdated: 'Oct 8, 2024',
      version: '2.1',
      features: ['API Access', 'Citations', 'Real-time Search', 'Multi-language Support'],
      integrations: ['Chrome Extension', 'iOS', 'Android', 'REST API'],
      website: 'https://www.perplexity.ai',
      demoUrl: 'https://www.perplexity.ai'
    },
    {
      id: 'stable-diffusion',
      slug: 'stable-diffusion',
      name: 'Stable Diffusion',
      description: 'Open-source AI image generation model',
      longDescription: 'Stable Diffusion is a powerful open-source AI model for generating high-quality images from text prompts. Run it locally or in the cloud.',
      category: 'image-generation',
      developer: 'Stability AI',
      rating: 4.5,
      totalRatings: 67800,
      size: '2.1 GB',
      price: 'Free',
      tags: ['Open Source', 'Image', 'Art', 'Design'],
      icon: 'https://stablediffusionweb.com/favicon.ico',
      screenshots: [],
      featured: true,
      downloadCount: '30M+',
      lastUpdated: 'Sep 25, 2024',
      version: 'SDXL 1.0',
      features: ['Open Source', 'Local Installation', 'Custom Training', 'Community Models'],
      integrations: ['Automatic1111', 'ComfyUI', 'InvokeAI', 'DreamStudio'],
      website: 'https://stability.ai',
      demoUrl: 'https://stablediffusionweb.com'
    },
    {
      id: 'notion-ai',
      slug: 'notion-ai',
      name: 'Notion AI',
      description: 'AI-powered writing and productivity assistant within Notion',
      longDescription: 'Notion AI brings AI capabilities directly into your Notion workspace, helping you write, summarize, translate, and organize information faster.',
      category: 'productivity',
      developer: 'Notion Labs',
      rating: 4.2,
      totalRatings: 45600,
      size: '78 MB',
      price: 'Freemium',
      actualPrice: '$10/month',
      tags: ['Productivity', 'Writing', 'Notes', 'Organization'],
      icon: 'https://www.notion.so/images/favicon.ico',
      screenshots: [],
      downloadCount: '20M+',
      lastUpdated: 'Oct 4, 2024',
      version: '2.0',
      features: ['AI Writing', 'Summarization', 'Translation', 'Q&A', 'Database Autofill'],
      integrations: ['Google Drive', 'Slack', 'GitHub', 'Figma', 'REST API'],
      website: 'https://www.notion.so',
      demoUrl: 'https://www.notion.ai'
    }
  ];
};

// ==================== SEED DATABASE ====================
const seedTools = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting database seeding...');
    console.log('='.repeat(60));

    // Get tools data
    const toolsData = readMockDataTools();

    // Clear existing tools
    const deleteResult = await Tool.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing tools`);

    // Insert new tools
    const tools = await Tool.insertMany(toolsData);
    console.log(`✅ Successfully seeded ${tools.length} tools to database`);

    console.log('='.repeat(60));
    console.log('🎉 Database seeding complete!');
    console.log('\\nSeeded tools by category:');
    
    const categories = {};
    tools.forEach(tool => {
      categories[tool.category] = (categories[tool.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  • ${category}: ${count} tools`);
    });

    console.log('\\n📝 Sample tools:');
    tools.slice(0, 5).forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} (${tool.category}) - ${tool.rating}⭐`);
    });

    console.log('\\n💡 Next steps:');
    console.log('  1. Start backend: npm run dev');
    console.log('  2. Test API: http://localhost:5000/api/tools');
    console.log('  3. Update frontend to use this API');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// ==================== RUN SEEDING ====================
seedTools();
