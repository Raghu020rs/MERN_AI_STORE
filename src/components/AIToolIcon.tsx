import { useState } from 'react';

interface AIToolIconProps {
  icon: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-8 h-8',
  medium: 'w-10 h-10',
  large: 'w-12 h-12',
};

const emojiSizes = {
  small: 'text-xl',
  medium: 'text-2xl',
  large: 'text-3xl',
};

// Emoji fallbacks for common categories
const categoryEmojis: Record<string, string> = {
  chatgpt: '🤖',
  claude: '🧠',
  gemini: '✨',
  grok: '⚡',
  midjourney: '🎨',
  perplexity: '🔍',
  github: '💻',
  runway: '🎬',
  jasper: '📝',
  stable: '🖼️',
  notion: '📋',
  copy: '✍️',
  write: '📝',
  grammar: '✅',
  quill: '🪶',
  rytr: '📄',
  dall: '🎨',
  canva: '🎨',
  leonardo: '🎮',
  adobe: '🔥',
  ideogram: '💭',
  synthesia: '🎭',
  d_id: '🗣️',
  pictory: '📹',
  descript: '🎬',
  eleven: '🎤',
  murf: '🎙️',
  play: '▶️',
  speech: '📖',
  intercom: '💬',
  tidio: '🤖',
  drift: '💼',
  otter: '🦦',
  fireflies: '🔥',
  motion: '⚡',
  reclaim: '📅',
  cursor: '💻',
  tabnine: '⚡',
  codeium: '💻',
  amazon: '☁️',
  surfer: '🌊',
  frase: '📝',
  adcreative: '📢',
  julius: '📊',
  rows: '📊',
  wordtune: '✍️',
  anyword: '📝',
  sudowrite: '📚',
  playground: '🎨',
  night: '🌙',
  art: '🧬',
  craiyon: '🖍️',
  dream: '💭',
  remove: '🎯',
  fliki: '🎥',
  lumen: '💡',
  invideo: '🎬',
  kaiber: '🎨',
  heygen: '👤',
  resemble: '🔊',
  aiva: '🎵',
  mubert: '🎶',
  sound: '🎵',
  many: '💬',
  landbot: '🤖',
  chatfuel: '⚡',
  ada: '💬',
  superhuman: '⚡',
  mem: '🧠',
  bardeen: '🔮',
  clockwise: '⏰',
  tldv: '📹',
  replit: '👻',
  sourcegraph: '🔍',
  code: '💻',
  continue: '➡️',
  semrush: '📈',
  market: '📊',
  phrasee: '✍️',
  consensus: '🔬',
  elicit: '📚',
  scite: '🔬',
  semantic: '🔬',
  research: '🔍',
  figma: '🎨',
  uizard: '✨',
  khroma: '🎨',
  character: '🤖',
  hugging: '🤗',
  pika: '🎬',
  topaz: '💎',
  tome: '📖',
  gamma: '✨',
  beautiful: '✨',
  luma: '💡',
  clip: '✂️',
  pixlr: '🎨',
  photo: '📸',
  durable: '🌐',
  wix: '🌐',
  framer: '🎨',
  brand: '🎨',
  looka: '👁️',
  bing: '🔍',
  you: '🔍',
  poe: '🤖',
  scale: '📈',
  clean: '🎙️',
  cohere: '🧠',
  mistral: '🌬️',
  anthropic: '🧠',
  stability: '🖼️',
  reimagine: '🏠',
  jenni: '📚',
  spline: '🎲',
  chat: '📑',
  slides: '📊',
  taskade: '✅',
};

function getEmojiForTool(toolId: string): string {
  // Try to find a matching emoji based on tool ID
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (toolId.toLowerCase().includes(key)) {
      return emoji;
    }
  }
  // Default fallback
  return '🔧';
}

export function AIToolIcon({ icon, name, size = 'medium', className = '' }: AIToolIconProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if it's a URL (http/https) or a local path (starts with /)
  const isUrl = icon.startsWith('http') || icon.startsWith('/');
  
  if (!isUrl || hasError) {
    // Show emoji (either original or fallback)
    return (
      <span className={`${emojiSizes[size]} ${className}`}>
        {hasError ? getEmojiForTool(name.toLowerCase().replace(/\s+/g, '_')) : icon}
      </span>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative rounded-lg`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={icon}
        alt={name}
        className={`${sizeClasses[size]} object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity rounded-lg drop-shadow-md`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
