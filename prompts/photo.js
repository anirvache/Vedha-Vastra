// The exact instructions sent to the AI image model. Edit the words here to improve results.
// Tip: change ONE thing at a time, then test with the same three photos.

export const SHOTS = [
  { id: 1, name: 'Full-length front',
    text: 'Full-length front view. The whole saree is visible from head to floor, centred in the frame, pleats neatly arranged, pallu draped over the left shoulder and falling at the back.' },
  { id: 2, name: 'Three-quarter angle',
    text: 'Three-quarter angle view, mannequin turned about 35 degrees, showing the fall of the pleats and the way the fabric flows. Whole saree visible.' },
  { id: 3, name: 'Pallu display',
    text: 'The pallu (mundhani) brought to the front and spread so its full design and border are clearly visible. Medium shot from the waist up, with the saree body and blouse also visible.' },
  { id: 4, name: 'Back and blouse view',
    text: 'Back view showing the blouse back and how the pallu falls. Whole upper body of the mannequin visible, fabric texture crisp.' },
  { id: 5, name: 'Detail close-up',
    text: 'Close-up detail shot of the border, zari and weave texture, in very sharp focus, fabric folds visible, shallow depth of field.' },
];

export const BACKDROPS = {
  cream: 'a seamless warm cream studio backdrop with a soft floor gradient',
  grey: 'a seamless soft neutral grey studio backdrop',
  maroon: 'a seamless deep muted maroon studio backdrop',
};

export const MANNEQUINS = {
  full: 'a headless, matte neutral full-length female mannequin on a slim stand',
  torso: 'a headless, matte neutral female torso mannequin on a slim stand',
};

export function buildPhotoPrompt({ shot, backdrop, mannequin }) {
  const s = SHOTS.find((x) => x.id === Number(shot)) || SHOTS[0];
  const bg = BACKDROPS[backdrop] || BACKDROPS.cream;
  const mq = MANNEQUINS[mannequin] || MANNEQUINS.full;

  return [
    'You are a professional fashion e-commerce photographer and retoucher.',
    'Create ONE photorealistic studio photograph of a saree draped on ' + mq + '.',
    '',
    'REFERENCE IMAGES (provided with labels):',
    '- Image A is the saree body fabric.',
    '- Image B is the blouse.',
    '- Image C is the pallu / mundhani.',
    'Reproduce the exact colours, weave, motifs, border and zari from the references.',
    'Do NOT invent new designs, change colours, add patterns, or add text, logos or watermarks.',
    'The saree must look like the real product, because customers will receive this exact saree.',
    '',
    'SHOT: ' + s.text,
    '',
    'STUDIO RULES:',
    '- Background: ' + bg + '.',
    '- Lighting: large soft diffused key light at about 45 degrees, gentle fill light, subtle rim light, even exposure, no harsh shadows.',
    '- True-to-life colour with neutral white balance. Do not over-saturate.',
    '- Sharp fabric texture and clean fabric folds. Look of an 85mm lens, f/5.6.',
    '- Mannequin centred, with comfortable space around, consistent framing.',
    '- No people, no faces, no hands, no props, no text.',
    '',
    'OUTPUT: a single portrait 3:4 image.',
  ].join('\n');
}
