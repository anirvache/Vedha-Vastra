// The ONLY file that asks Gemini to write text.

import { callGemini, imagePart } from './gemini_core';

export async function writeDescription({ promptText, imageDataUrls }) {
  const model = process.env.GEMINI_TEXT_MODEL || 'gemini-3.5-flash';
  const parts = [{ text: promptText }];
  for (const u of imageDataUrls || []) parts.push(imagePart(u));

  const data = await callGemini(model, {
    contents: [{ parts }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  });

  const cand = data.candidates && data.candidates[0];
  const text = ((cand && cand.content && cand.content.parts) || [])
    .map((p) => p.text || '').join('').trim();
  if (!text) throw new Error('The AI did not return any text');

  const clean = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    throw new Error('The AI did not return a readable answer');
  }
}
