const fs = require('fs');

// Icon mappings for all tools
const iconMappings = {
  // Original AI Tools
  'chatgpt': 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
  'claude': 'https://claude.ai/favicon.ico',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'grok': 'https://x.ai/favicon.ico',
  'midjourney': 'https://www.midjourney.com/favicon.ico',
  'perplexity': 'https://www.perplexity.ai/favicon.ico',
  'github-copilot': 'https://github.githubassets.com/favicons/favicon.svg',
  'runway-ml': 'https://runwayml.com/favicon.ico',
  'jasper-ai': 'https://www.jasper.ai/favicon.ico',
  'stable-diffusion': 'https://stablediffusionweb.com/favicon.ico',
  'notion-ai': 'https://www.notion.so/images/favicon.ico',
  
  // Additional Tools
  'copyai': 'https://www.copy.ai/favicon.ico',
  'writesonic': 'https://writesonic.com/favicon.ico',
  'grammarly': 'https://static.grammarly.com/assets/files/efe97bc841dd3cc46c529574982c19fd/favicon.svg',
  'quillbot': 'https://quillbot.com/favicon.ico',
  'rytr': 'https://rytr.me/favicon.ico',
  'dalle3': 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
  'canva-ai': 'https://static.canva.com/web/images/favicon.ico',
  'leonardo-ai': 'https://leonardo.ai/favicon.ico',
  'adobe-firefly': 'https://www.adobe.com/favicon.ico',
  'ideogram': 'https://ideogram.ai/favicon.ico',
  'synthesia': 'https://www.synthesia.io/favicon.ico',
  'd-id': 'https://www.d-id.com/favicon.ico',
  'pictory': 'https://pictory.ai/favicon.ico',
  'descript': 'https://www.descript.com/favicon.ico',
  'elevenlabs': 'https://elevenlabs.io/favicon.ico',
  'murf-ai': 'https://murf.ai/favicon.ico',
  'play-ht': 'https://play.ht/favicon.ico',
  'speechify': 'https://speechify.com/favicon.ico',
  'intercom-fin': 'https://www.intercom.com/favicon.ico',
  'tidio': 'https://www.tidio.com/favicon.ico',
  'drift': 'https://www.drift.com/favicon.ico',
  'otter-ai': 'https://otter.ai/favicon.ico',
  'fireflies-ai': 'https://fireflies.ai/favicon.ico',
  'motion': 'https://www.usemotion.com/favicon.ico',
  'reclaim-ai': 'https://reclaim.ai/favicon.ico',
  'cursor': 'https://cursor.sh/favicon.ico',
  'tabnine': 'https://www.tabnine.com/favicon.ico',
  'codeium': 'https://codeium.com/favicon.ico',
  'amazon-codewhisperer': 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
  'surfer-seo': 'https://surferseo.com/favicon.ico',
  'frase': 'https://www.frase.io/favicon.ico',
  'adcreative-ai': 'https://www.adcreative.ai/favicon.ico',
  'julius-ai': 'https://julius.ai/favicon.ico',
  'rows': 'https://rows.com/favicon.ico',
  
  // Wave 2
  'wordtune': 'https://www.wordtune.com/favicon.ico',
  'anyword': 'https://anyword.com/favicon.ico',
  'sudowrite': 'https://www.sudowrite.com/favicon.ico',
  'playground-ai': 'https://playgroundai.com/favicon.ico',
  'nightcafe': 'https://creator.nightcafe.studio/favicon.ico',
  'artbreeder': 'https://www.artbreeder.com/favicon.ico',
  'craiyon': 'https://www.craiyon.com/favicon.ico',
  'dreamstudio': 'https://dreamstudio.ai/favicon.ico',
  'remove-bg': 'https://www.remove.bg/favicon.ico',
  'fliki': 'https://fliki.ai/favicon.ico',
  'lumen5': 'https://lumen5.com/favicon.ico',
  'invideo': 'https://invideo.io/favicon.ico',
  'kaiber': 'https://kaiber.ai/favicon.ico',
  'heygen': 'https://www.heygen.com/favicon.ico',
  'resemble-ai': 'https://www.resemble.ai/favicon.ico',
  'aiva': 'https://www.aiva.ai/favicon.ico',
  'mubert': 'https://mubert.com/favicon.ico',
  'soundraw': 'https://soundraw.io/favicon.ico',
  'descript-overdub': 'https://www.descript.com/favicon.ico',
  'manychat': 'https://manychat.com/favicon.ico',
  'landbot': 'https://landbot.io/favicon.ico',
  'chatfuel': 'https://chatfuel.com/favicon.ico',
  'ada-cx': 'https://www.ada.cx/favicon.ico',
  'superhuman': 'https://superhuman.com/favicon.ico',
  'mem': 'https://get.mem.ai/favicon.ico',
  'bardeen': 'https://www.bardeen.ai/favicon.ico',
  'clockwise': 'https://www.getclockwise.com/favicon.ico',
  'tldv': 'https://tldv.io/favicon.ico',
  'replit-ghostwriter': 'https://replit.com/public/images/favicon.ico',
  'sourcegraph-cody': 'https://sourcegraph.com/favicon.ico',
  'codegeex': 'https://codegeex.cn/favicon.ico',
  'continue-dev': 'https://continue.dev/favicon.ico',
  'semrush': 'https://www.semrush.com/favicon.ico',
  'marketmuse': 'https://www.marketmuse.com/favicon.ico',
  'phrasee': 'https://phrasee.co/favicon.ico',
  'consensus': 'https://consensus.app/favicon.ico',
  'elicit': 'https://elicit.org/favicon.ico',
  'scite': 'https://scite.ai/favicon.ico',
  'semantic-scholar': 'https://www.semanticscholar.org/img/favicon.ico',
  'researchrabbit': 'https://www.researchrabbit.ai/favicon.ico',
  'figma-ai': 'https://static.figma.com/app/icon/1/favicon.svg',
  'uizard': 'https://uizard.io/favicon.ico',
  'khroma': 'https://www.khroma.co/favicon.ico',
  
  // Wave 3
  'character-ai': 'https://character.ai/favicon.ico',
  'huggingface': 'https://huggingface.co/favicon.ico',
  'pika-labs': 'https://pika.art/favicon.ico',
  'topaz-ai': 'https://www.topazlabs.com/favicon.ico',
  'tome-ai': 'https://tome.app/favicon.ico',
  'gamma-ai': 'https://gamma.app/favicon.ico',
  'beautiful-ai': 'https://www.beautiful.ai/favicon.ico',
  'runway-gen2': 'https://runwayml.com/favicon.ico',
  'luma-ai': 'https://lumalabs.ai/favicon.ico',
  'clipdrop': 'https://clipdrop.co/favicon.ico',
  'pixlr-ai': 'https://pixlr.com/favicon.ico',
  'photoroom': 'https://www.photoroom.com/favicon.ico',
  'durable-ai': 'https://durable.co/favicon.ico',
  'wix-ai': 'https://www.wix.com/favicon.ico',
  'framer-ai': 'https://www.framer.com/favicon.ico',
  'brandmark': 'https://brandmark.io/favicon.ico',
  'looka': 'https://looka.com/favicon.ico',
  'bing-ai': 'https://www.bing.com/favicon.ico',
  'you-chat': 'https://you.com/favicon.ico',
  'poe-ai': 'https://poe.com/favicon.ico',
  
  // Wave 4
  'scalenut': 'https://www.scalenut.com/favicon.ico',
  'invideo-ai': 'https://invideo.io/favicon.ico',
  'kapwing': 'https://www.kapwing.com/favicon.ico',
  'cleanvoice': 'https://cleanvoice.ai/favicon.ico',
  'cohere': 'https://cohere.com/favicon.ico',
  'runway-gen3': 'https://runwayml.com/favicon.ico',
  'anthropic-claude-opus': 'https://claude.ai/favicon.ico',
  'stability-sdxl': 'https://stability.ai/favicon.ico',
  'mistral-ai': 'https://mistral.ai/favicon.ico',
  'anthropic-claude-sonnet': 'https://claude.ai/favicon.ico',
  'runwayml-inpainting': 'https://runwayml.com/favicon.ico',
  'perplexity-pages': 'https://www.perplexity.ai/favicon.ico',
  'taskade': 'https://www.taskade.com/favicon.ico',
  'reimagine-home': 'https://reimaginehome.ai/favicon.ico',
  'jenni-ai': 'https://jenni.ai/favicon.ico',
  'spline-ai': 'https://spline.design/favicon.ico',
  'murf-ai': 'https://murf.ai/favicon.ico',
  'chatpdf': 'https://www.chatpdf.com/favicon.ico',
  'slidesai': 'https://www.slidesai.io/favicon.ico',
};

// Read the file
const filePath = './src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace each icon
let replacedCount = 0;
for (const [id, iconUrl] of Object.entries(iconMappings)) {
  // Match pattern: id: 'tool-id', ... icon: 'emoji or old url',
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?icon: )'[^']*'`, 'g');
  const newContent = content.replace(regex, `$1'${iconUrl}'`);
  if (newContent !== content) {
    replacedCount++;
    content = newContent;
  }
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ Successfully updated ${replacedCount} tool icons with real logos!`);
console.log(`📊 Total icons mapped: ${Object.keys(iconMappings).length}`);
