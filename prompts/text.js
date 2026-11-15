// The exact instructions sent to the AI text model. Edit the words to change tone and rules.

const TONES = {
  Traditional: 'Warm, graceful and rooted in tradition. Speak of heritage, craft and occasions.',
  Modern: 'Fresh, confident and stylish. Speak of styling, versatility and how it feels to wear.',
  Short: 'Very brief and direct. The description should be about 40 to 55 words.',
};

export function buildTextPrompt({ fields, tone, language }) {
  const f = fields || {};
  const facts = [
    ['Name', f.name], ['Category', f.category], ['Colour', f.colour], ['Fabric', f.fabric],
    ['Occasion', f.occasion], ['Fashion style', f.style], ['Length', f.length],
    ['Blouse', f.blouse_info], ['Care', f.care], ['Extra notes', f.notes],
  ].filter(([, v]) => v && String(v).trim())
   .map(([k, v]) => '- ' + k + ': ' + String(v).trim()).join('\n');

  return [
    'You write product descriptions for a small, trusted saree boutique in India.',
    'Write in ' + (language || 'English') + '. Tone: ' + (TONES[tone] || TONES.Traditional),
    '',
    'FACTS ENTERED BY THE SHOPKEEPER (the only facts you may state):',
    facts || '- (none)',
    '',
    'Photos of the saree may be attached. You may describe visible colours, motifs and border, but only what you can clearly see.',
    '',
    'STRICT RULES:',
    '1. Use only the facts above and what is clearly visible. Never invent claims.',
    '2. Never say "pure silk", "handloom", "pure zari", "authentic" or any certification unless it appears in the facts.',
    '3. No false urgency or scarcity such as "only few left" or "hurry".',
    '4. No exaggeration. Be specific and sensory rather than generic.',
    '5. The description is 80 to 120 words (unless the tone says shorter), in 2 short paragraphs.',
    '6. Weave the fashion style into a styling suggestion (how and where to wear it).',
    '7. Plain text only in "description". No emojis there. Captions may use at most 2 emojis.',
    '',
    'Return ONLY valid JSON, with exactly these keys and no extra text:',
    '{',
    '  "headline": "short product headline, max 8 words",',
    '  "hook": "one inviting line, max 18 words",',
    '  "description": "the product description",',
    '  "fabric_care": "one short sentence on fabric and care",',
    '  "styling": "one sentence styling suggestion",',
    '  "whatsapp_caption": "a friendly 2 line message to share on WhatsApp",',
    '  "instagram_captions": ["caption 1", "caption 2"]',
    '}',
  ].join('\n');
}
