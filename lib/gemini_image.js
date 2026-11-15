// The ONLY file that asks Gemini to make pictures.

import { callGemini, imagePart } from './gemini_core';

export async function generateShot({ promptText, images }) {
  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';
  const parts = [{ text: promptText }];
  for (const im of images) {
    parts.push({ text: im.label });
    parts.push(imagePart(im.dataUrl));
  }
  const data = await callGemini(model, {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '3:4' },
    },
  });

  const out = (data.candidates && data.candidates[0] && data.candidates[0].content &&
    data.candidates[0].content.parts) || [];
  for (const p of out) {
    if (p.thought) continue;
    const inline = p.inlineData || p.inline_data;
    if (inline && inline.data) {
      return { mime: inline.mimeType || inline.mime_type || 'image/png', data: inline.data };
    }
  }
  throw new Error('The AI did not return a picture');
}
